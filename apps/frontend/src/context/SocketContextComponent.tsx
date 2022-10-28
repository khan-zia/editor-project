import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../../backend/socket';
import { useSocket } from '../notes/hooks';
import { defaultSocketState, SocketContextProvider, socketReducer } from './socketContext';

const SocketContextComponent: React.FC<unknown> = (props) => {
  const { children } = props;
  const [socketState, socketDispatch] = useReducer(socketReducer, defaultSocketState);
  const [conError, setConError] = useState<boolean>(false);

  // Set up a websocket connection. Hook automatically disconnects upon un-mount.
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useSocket();

  // Register general socket events.
  const registerEvents = () => {
    // When a new note is added.
    socket.on('incoming-new-note', (noteId, newTitle) => {
      socketDispatch({
        type: 'add_note',
        payload: { id: noteId, title: newTitle },
      });
    });

    // When a note's title is updated.
    socket.on('incoming-new-title', (noteId, newTitle) => {
      // Update note's title in the side bar menu.
      socketDispatch({
        type: 'update_title',
        payload: { id: noteId, title: newTitle },
      });

      // Update note's title in case note is open via the SingleNote component
      // for other clients.
      socketDispatch({
        type: 'update_current_title',
        payload: newTitle,
      });
    });

    // When all attempts to establish WS connection fails.
    socket.io.on('reconnect_failed', () => setConError(true));
  };

  useEffect(() => {
    // Attempt to establish connection on mount.
    socket.connect();

    // Register all events.
    registerEvents();
  }, []);

  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setConError(false);
  };

  return (
    <SocketContextProvider value={{ socket, socketState, socketDispatch }}>
      <>
        <Snackbar
          open={conError}
          autoHideDuration={7000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={handleClose}>
            Ops! We were unable to establish live connection with the server. You may not receive real time updates.
          </Alert>
        </Snackbar>
        {children}
      </>
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
