import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Paper, TextField, Badge, BadgeTypeMap, Snackbar, Alert, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useServerRequest } from './hooks';
import { Editor } from '../editor';
import { useSocketContext } from '../context/socketContext';

interface SingleNoteProps {
  id: string;
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const { socket } = useSocketContext();

  const {
    executeRequest: updateNoteTitle,
    isLoading: noteTitleUpdating,
    isSuccess: noteTitleUpdated,
    isError: noteTitleUpdateError,
    reset: resetUpdateNoteTitleQuery,
  } = useServerRequest('put', `api/notes/${id}/title`);

  const [connectionStatusColor, setConnectionStatusColor] = useState<BadgeTypeMap['props']['color']>('error');
  const [localTitle, setLocalTitle] = useState<string>(''); // This simply helps toggle the "save" button for title.
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<Uint8Array | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<boolean>(false);

  /**
   * Initializes current note:
   * - Join a socket room by note's ID.
   * - Fetch note by the specified ID.
   * - Set note's title for real-time tracking.
   * - Set note's content in the local state.
   * - Start listening for room's events.
   */
  const initializeNote = useCallback(async () => {
    // Because Next.js hydrates client side route/query params after the first render,
    // make sure the ID from the URL is defined before executing the request.
    if (!id || id === 'undefined') {
      return;
    }

    // Set fetching for loading animation until WS handshake resolves.
    setFetching(true);

    /**
     * Join socket room by note id and fetch note's content from the database.
     * Note's content will be fetched as a byte array (yjs CRDT).
     */
    socket?.emit('join-note', id, (title, content) => {
      // Stop loading animation.
      setFetching(false);

      // If no title or content was returned.
      if (!title || !content) {
        setFetchError(true);
        return;
      }

      // Set note's title.
      setTitle(title);
      setLocalTitle(title);

      // Set note's content.
      const typedBufferContent = new Uint8Array(content);
      setContent(typedBufferContent);
    });

    // When other clients updates title of this note.
    socket?.on('incoming-new-title', (noteId, newTitle) => {
      if (noteId === id) {
        setTitle(newTitle);
        setLocalTitle(newTitle);
      }
    });
  }, [id]);

  // Upon mount, initialize note.
  useEffect(() => {
    initializeNote();
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
      // Update localTitle to hide the "save" button.
      setLocalTitle(title);

      // Emit the title update for other clients.
      socket?.emit('note-title-updated', id, title);
    }
  }, [noteTitleUpdated]);

  // Handle closure of SnackBars on this component.
  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // Reset states to keep the snackbar hidden.
    setFetchError(false);
    resetUpdateNoteTitleQuery();
  };

  return (
    <>
      {fetching && (
        <>
          <Skeleton sx={{ fontSize: '3.5rem', bgcolor: 'white' }} />
          <Skeleton variant="rectangular" height={400} sx={{ bgcolor: 'white' }} />
        </>
      )}
      {content && (
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
                endAdornment: localTitle !== title && (
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
            <Editor id={id} initialValue={content} />
          </Paper>
        </>
      )}
      <Snackbar
        open={fetchError || noteTitleUpdateError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose}>
          {fetchError && 'Ops! Could not fetch the specified note. Perhaps it does not exist?'}
          {noteTitleUpdateError && "Ops! There was a problem while trying to update note's title."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
