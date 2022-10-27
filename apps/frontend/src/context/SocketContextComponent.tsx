import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../../backend/socket';
import { useSocket } from '../notes/hooks';
import { defaultSocketState, SocketContextProvider, SocketReducer } from './socketContext';

const SocketContextComponent: React.FC<unknown> = (props) => {
  const { children } = props;
  const [socketState, socketDispatch] = useReducer(SocketReducer, defaultSocketState);
  const [conError, setConError] = useState<boolean>(false);

  // Set up a websocket connection. Hook automatically disconnects upon un-mount.
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useSocket('ws://localhost:3001');

  // Register events related to a new note e.g. new-note-created.
  const registerEvents = () => {
    socket.on('incoming-new-note', (note) => {
      if (note && typeof note === 'string') {
        socketDispatch({ type: 'update_notes', payload: JSON.parse(note) });
      }
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

  useEffect(() => {
    if (socketState.newNoteCreated) {
      socket.emit('new-note-created', socketState.newNoteCreated);
    }
  }, [socketState.newNoteCreated]);

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
