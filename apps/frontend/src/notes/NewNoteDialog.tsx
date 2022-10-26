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
import { NoteResponse } from '../../../backend/routes/notes';
import { useSWRConfig } from 'swr';

interface NewNoteDialogProps {
  open: boolean;
  handleClose: () => void;
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({ open, handleClose }) => {
  const [title, setTitle] = useState('');
  const {
    executeRequest: createNewNote,
    isLoading,
    isSuccess,
    isError,
  } = useServerRequest('post', 'http://localhost:3001/api/notes');
  const [error, setError] = useState<string | undefined>(undefined);
  const [note, SetNote] = useState<NoteResponse | undefined>(undefined);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const create = async () => {
    if (!title) {
      setError('Choose a name for your note.');
      return;
    }

    // create a new note.
    const newNote = (await createNewNote({ title })) as NoteResponse;
    SetNote(newNote);
  };

  useEffect(() => {
    if (isSuccess && note) {
      handleClose();
      mutate('http://localhost:3001/api/notes');
      router.push(`/notes/${note.id}`);
    }
  }, [isSuccess, note]);

  useEffect(() => {
    if (isError) {
      setError('Ops! There was a problem while trying to create a new note.');
    }
  }, [isError]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a new note</DialogTitle>
      <DialogContent>
        {error && <DialogContentText sx={{ color: 'red' }}>{error}</DialogContentText>}
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
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton loading={isLoading} onClick={create}>
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default NewNoteDialog;
