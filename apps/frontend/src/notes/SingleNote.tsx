import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Paper, TextField, Badge, BadgeTypeMap, Snackbar, Alert, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useServerRequest } from './hooks';
import { Editor } from '../editor';
import { NoteResponse } from '../../../backend/routes/notes';
import { useSocketContext } from '../context/socketContext';

interface SingleNoteProps {
  id: string;
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const { socket, socketDispatch } = useSocketContext();

  const {
    executeRequest: getNoteById,
    isLoading,
    isError: getNoteByIdError,
    reset: resetGetNoteQuery,
    abort,
  } = useServerRequest('get', `api/notes/${id}`);

  const {
    executeRequest: updateNoteTitle,
    isLoading: noteTitleUpdating,
    isSuccess: noteTitleUpdated,
    isError: noteTitleUpdateError,
    reset: resetUpdateNoteTitleQuery,
  } = useServerRequest('put', `api/notes/${id}/title`);

  const [connectionStatusColor, setConnectionStatusColor] = useState<BadgeTypeMap['props']['color']>('error');
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<NoteResponse | undefined>(undefined);

  /**
   * Initializes current note:
   * - Fetch note by the specified ID.
   * - Set note in the local state.
   * - Set note's title for real-time tracking.
   * - Join a socket room by note's ID.
   * - Start listening for room's events.
   */
  const initializeNote = useCallback(async () => {
    // Because Next.js hydrates client side route/query params after the first render,
    // make sure the ID from the URL is defined before executing the request.
    if (!id || id === 'undefined') {
      return;
    }

    const fetched: NoteResponse | void = await getNoteById();

    // If the promise resolves with non-void value, note has been fetched.
    if (fetched) {
      setNote(fetched);

      // Set note's title separately to track changes to it for dynamically displaying
      // the "save" button.
      setTitle(fetched.title);

      // Join socket room by note id.
      socket?.emit('join-note', id);

      // When other clients updates title of this note.
      socket?.on('incoming-new-title', (noteId, newTitle) => {
        if (noteId === id) {
          setTitle(newTitle);
        }
      });
    }
  }, [id]);

  // Upon mount, initialize note.
  useEffect(() => {
    initializeNote();

    // Abort previous request if any before running a new request,
    // Or abort a running request if the component unmounts.
    return () => abort();
  }, [initializeNote]);

  // Handle socket connection status
  useEffect(() => {
    if (socket?.connected) {
      setConnectionStatusColor('success');
    } else {
      setConnectionStatusColor('error');
    }
  }, [socket?.connected]);

  // Handle result of updateNoteTitle call.
  useEffect(() => {
    if (noteTitleUpdated) {
      // Update socket state's note title to hide the "save" button.
      socketDispatch({
        type: 'update_current_title',
        payload: title,
      });

      // Emit the title update for other clients.
      socket?.emit('note-title-updated', id, title);
    }
  }, [noteTitleUpdated]);

  // Handle closure of SnackBars on this component.
  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // Reset request states to keep the snackbar hidden.
    resetGetNoteQuery();
    resetUpdateNoteTitleQuery();
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
              value={title}
              variant="standard"
              fullWidth={true}
              inputProps={{ style: { fontSize: 32, color: '#666' } }}
              sx={{ mb: 2 }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)}
              InputProps={{
                endAdornment: note?.title !== title && (
                  <LoadingButton loading={noteTitleUpdating} onClick={() => updateNoteTitle({ title })}>
                    Save
                  </LoadingButton>
                ),
              }}
            />
          </Badge>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Editor id={id} initialValue={note.content} />
          </Paper>
        </>
      )}
      <Snackbar
        open={getNoteByIdError || noteTitleUpdateError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose}>
          {getNoteByIdError && 'Ops! Could not fetch the specified note. Perhaps it does not exist?'}
          {noteTitleUpdateError && "Ops! There was a problem while trying to update note's title."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
