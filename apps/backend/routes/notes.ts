import express, { Request, RequestHandler, Response } from 'express';
import { Descendant } from 'slate';
import db from '../firebase';

const router = express.Router();

export interface Note {
  id: string;
  title: string;
  content?: Array<Descendant>;
}

export interface NotesResponse {
  notes: Array<{
    id: string;
    title: string;
  }>;
}

export interface NoteResponse extends Note {
  content: Array<Descendant>;
}

// Get all notes (Only IDs and Titles)
const notesHandler: RequestHandler = async (_req, res: Response<NotesResponse | null>) => {
  try {
    const notes = await db.collection('notes').select('title').get();

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
const createNoteHandler: RequestHandler = async (req, res: Response<Note | null>) => {
  try {
    const emptySlateNote = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];

    const newNote = await db.collection('notes').add({
      title: req.body.title,
      content: JSON.stringify(emptySlateNote), // Set initial empty value for Slate
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
const updateNoteTitleHandler: RequestHandler = async (req, res: Response<true | null>) => {
  try {
    await db.collection('notes').doc(req.params.id).update({
      title: req.body.title,
    });

    res.json(true);
  } catch (_e) {
    res.status(500).json(null);
  }
};

// Update a note's content
const updateNoteContentHandler: RequestHandler = async (req, res: Response<true | null>) => {
  try {
    await db.collection('notes').doc(req.params.id).update({
      content: req.body.content, // Already stringified by the frontend.
    });

    res.json(true);
  } catch (_e) {
    res.status(500).json(null);
  }
};

const noteHandler: RequestHandler = async (req: Request, res: Response<NoteResponse | null>) => {
  try {
    const noteResult = await db.collection('notes').doc(req.params.id).get();

    // TODO: Check that the result is not empty.

    const note = noteResult.data() as { title: string; content: string };

    res.send({
      id: noteResult.id,
      title: note.title,
      content: JSON.parse(note.content),
    });
  } catch (_e) {
    res.status(500).json(null);
  }
};

router.post('/', createNoteHandler);
router.get('/', notesHandler);
router.put('/:id/title', updateNoteTitleHandler);
router.put('/:id/content', updateNoteContentHandler);
router.get('/:id', noteHandler);

export default router;
