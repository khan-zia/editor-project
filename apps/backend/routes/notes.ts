import { slateNodesToInsertDelta } from '@slate-yjs/core';
import express, { RequestHandler, Response } from 'express';
import * as Y from 'yjs';
import multer from 'multer';
import db from '../firebase';

/**
 * Since express doesn't come with a built in multipart request support, multer allows
 * to receive multipart data in an express route.
 */
const multerHandler = multer();
const router = express.Router();

export interface Note {
  id: string;
  title: string;
  content: ArrayBuffer; // This is because YJS CRDT is represented as a byte array.
}

export interface NotesResponse {
  notes: Array<Omit<Note, 'content'>>;
}

/**
 * Fetches a note specified by ID from the Firestore database.
 * @param noteId Firestore ID of the note to fetch.
 */
export const fetchNote = async (noteId: string): Promise<Omit<Note, 'id'> | void> => {
  try {
    const noteResult = await db.collection('notes').doc(noteId).get();

    const note = noteResult.data() as { title: string; content: ArrayBuffer };

    return {
      title: note.title,
      content: note.content,
    };
  } catch (_e) {
    // Safely catch any Firestore crash. Enough for the purpose of this test.
    return;
  }
};

// Get all notes (Only IDs and Titles)
const notesHandler: RequestHandler = async (_req, res: Response<NotesResponse | null>) => {
  try {
    const notes = await db.collection('notes').orderBy('timestamp', 'desc').select('title').get();

    res.json({
      notes: notes.docs.map((note) => {
        return {
          id: note.id,
          title: note.data().title,
        };
      }),
    });
  } catch (_e) {
    res.status(500).json(null);
  }
};

// Create a new note
const createNoteHandler: RequestHandler = async (req, res: Response<Omit<Note, 'content'> | null>) => {
  try {
    // An initial value for the new note.
    const emptySlateNote = [{ children: [{ text: '' }] }];

    // Convert the note's initial value to a CRDT.
    const ydoc = new Y.Doc();
    const deltaVersionOfSlate = slateNodesToInsertDelta(emptySlateNote);
    const sharedRootDoc = ydoc.get('content', Y.XmlText) as Y.XmlText;
    sharedRootDoc.applyDelta(deltaVersionOfSlate);
    const CRDTBytes = Y.encodeStateAsUpdate(ydoc);

    const newNote = await db.collection('notes').add({
      title: req.body.title,
      content: CRDTBytes, // Firestore will save it as Blob.
      timestamp: Math.floor(Date.now() / 1000), // Used to sort notes for the sidebar menu.
    });

    const data = (await newNote.get()).data();

    const note = {
      id: newNote.id,
      title: data?.title,
    };

    res.json(note);
  } catch (_e) {
    res.status(500).json(null);
  }
};

// Update a note's title
const updateNoteTitleHandler: RequestHandler = async (req, res: Response<Record<string, unknown>>) => {
  try {
    await db.collection('notes').doc(req.params.id).update({
      title: req.body.title,
    });

    res.json({ success: true });
  } catch (_e) {
    res.status(500).json({ success: false });
  }
};

// Update a note's content
const updateNoteContentHandler: RequestHandler = async (req, res: Response<Record<string, unknown>>) => {
  try {
    // Simple validation
    if (!req.file) {
      throw 'No content to update.';
    }

    await db.collection('notes').doc(req.params.id).update({
      content: req.file.buffer,
    });

    res.json({ success: true });
  } catch (_e) {
    res.status(500).json({ success: false });
  }
};

router.post('/', createNoteHandler);
router.get('/', notesHandler);
router.put('/:id/title', updateNoteTitleHandler);
router.put('/:id/content', multerHandler.single('content'), updateNoteContentHandler);

export default router;
