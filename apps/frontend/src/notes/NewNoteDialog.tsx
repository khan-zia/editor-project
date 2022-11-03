import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useServerRequest } from './hooks';
import { Note } from '../../../backend/routes/notes';
import { useSWRConfig } from 'swr';
import { useSocketContext } from '../context/socketContext';

interface NewNoteDialogProps {
  open: boolean;
  handleClose: () => void;
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({ open, handleClose }) => {
  const { executeRequest: createNewNote, isLoading, isError } = useServerRequest('post', 'api/notes');

  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { socket } = useSocketContext();

  const create = async () => {
    if (!title) {
      setError('Choose a title for your note.');
      return;
    }

    // create a new note.
    const newNote: Note | void = await createNewNote({ title });

    if (newNote) {
      // Let other clients know about the new note in real time.
      socket?.emit('new-note-created', newNote.id, newNote.title);

      // Revalidate notes list data (refetch).
      mutate('http://localhost:3001/api/notes');

      // Close the dialog
      handleClose();

      // Navigate to the newly created note's page.
      router.push(`/notes/${newNote.id}`);
    }
  };

  useEffect(() => {
    if (isError) {
      setError('Ops! There was a problem while trying to create a new note.');
    }
  }, [isError]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" data-cy="new-note-dialog">
      <DialogTitle>Create a new note</DialogTitle>
      <DialogContent>
        {error && (
          <DialogContentText sx={{ color: 'red' }} data-cy="note-error-message">
            {error}
          </DialogContentText>
        )}
        <DialogContentText>Choose a title for your note.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="note_title"
          label="Note Title"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setTitle(e.target.value)}
          data-cy="new-note-input"
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose} data-cy="close-dialog-button">
          Cancel
        </Button>
        <LoadingButton loading={isLoading} onClick={create} data-cy="create-note-button">
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default NewNoteDialog;
