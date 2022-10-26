import express, { Request, RequestHandler, Response } from 'express';
import { WebsocketRequestHandler } from 'express-ws';
import { Descendant } from 'slate';
import { NOTE_1, NOTE_2 } from '../fixtures/notes';
import db from '../firebase';

// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method');
patch.default(express.Router);

const router = express.Router();

export interface NotesResponse {
  notes: Array<{
    id: string;
    title: string;
  }>;
}

export interface NoteResponse {
  id?: string;
  title: string;
  content: Array<Descendant>;
}

// Get all notes
const notesHandler: RequestHandler = async (_req, res: Response<NotesResponse>) => {
  const notesResult = (await db.collection('notes').get()).docs;

  // TODO: Check that the result is not empty.

  const notes = notesResult.map((note: any) => {
    return {
      id: note.id,
      title: note.data().title,
    };
  });

  res.json({
    notes,
  });
};

// Create a new note
const createNoteHandler: RequestHandler = async (req, res: Response<NoteResponse | null>) => {
  try {
    const emptySlateNote = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];

    const newNote = (await db.collection('notes').add({
      title: req.body.title,
      content: JSON.stringify(emptySlateNote), // Set initial empty value for Slate
    })) as unknown as NoteResponse;

    res.json({
      id: newNote.id,
      title: newNote.title,
      content: newNote.content,
    });
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
router.get('/:id', noteHandler);

export default router;
