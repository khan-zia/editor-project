import React, { useCallback, useEffect, useState } from 'react';
import { Editor } from '../editor';
import { useNote, useServerRequest } from './hooks';
import { ReadyState } from 'react-use-websocket';

import { Paper, TextField, Badge, BadgeTypeMap, Snackbar, Alert, Skeleton } from '@mui/material';
import { NoteResponse } from '../../../backend/routes/notes';

interface SingleNoteProps {
  id: string;
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const {
    executeRequest: getNoteById,
    isLoading,
    isSuccess,
    isError,
    reset,
    abort,
  } = useServerRequest('get', `http://localhost:3001/api/notes/${id}`);

  const [note, setNote] = useState<NoteResponse | undefined>(undefined);
  const [connectionStatusColor, setConnectionStatusColor] = useState<BadgeTypeMap['props']['color']>('error');

  // Call to fetch note by ID.
  const fetchNote = useCallback(async () => {
    const fetched = (await getNoteById()) as NoteResponse;
    if (fetched) {
      setNote(fetched);
    }
  }, [id]);

  // Upon mount, fetch note by ID using normal GET call.
  useEffect(() => {
    fetchNote();

    return () => abort();
  }, [fetchNote]);

  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // Reset server request's state.
    reset();
  };

  return (
    <>
      {isLoading && (
        <>
          <Skeleton sx={{ fontSize: '3.5rem', bgcolor: 'white' }} />
          <Skeleton variant="rectangular" height={400} sx={{ bgcolor: 'white' }} />
        </>
      )}
      {note && !isLoading && (
        <>
          <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
            <TextField
              value={note.title}
              variant="standard"
              fullWidth={true}
              inputProps={{ style: { fontSize: 32, color: '#666' } }}
              sx={{ mb: 2 }}
            />
          </Badge>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Editor initialValue={note.content} />
          </Paper>
        </>
      )}
      <Snackbar
        open={isError}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose}>
          Ops! Could not fetch the specified note. Perhaps it does not exist?
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
