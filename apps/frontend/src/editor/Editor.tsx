// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { Alert, Box, LinearProgress, Snackbar } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import * as Y from 'yjs';
import { withYHistory, withYjs, YjsEditor, yTextToSlateElement } from '@slate-yjs/core';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import hash from 'object-hash';
import { useServerRequest } from '../notes/hooks';
import PlateEditor from './Plate';
import { MyValue } from '../plate/typescript/plateTypes';
import { PlateEditor as PlateEditorType } from '@udecode/plate';
import { useSocketContext } from '../context/socketContext';

interface EditorProps {
  id: string;
  initialValue: Uint8Array;
}

export const Editor: React.FC<EditorProps> = ({ id, initialValue }) => {
  const { socket } = useSocketContext();

  const {
    executeRequest: saveNote,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useServerRequest('put', `api/notes/${id}/content`);

  // Stores hash of the note's content when it was last saved to compare it
  // to a current content hash. Helps avoid unnecessary save requests.
  const [lastSavedContent, setLastSavedContent] = useState<string | undefined>(undefined);

  // Create a blank CRDT document with origin.
  const ydoc = useRef(new Y.Doc());
  const thisOrigin = useRef(Math.random());

  /**
   * Handle saving the note automatically when there are changes.
   */
  const throttledSave = useThrottledCallback(
    () => {
      // Compute CRDT changes. Trigger save to the database only if there have been
      // changes since the last save operation.
      const currentCRDTContent = hash(yTextToSlateElement(ydoc.current.get('content', Y.XmlText) as Y.XmlText));

      if (lastSavedContent === currentCRDTContent) {
        return;
      }

      // Process saving updated CRDT in its original format (byte array). byte array can
      // be transmitted as blob over http in a multipart request.
      const fd = new FormData();
      fd.append('content', new Blob([Y.encodeStateAsUpdate(ydoc.current)]));
      saveNote(fd);
    },
    10000, // Once every 10 seconds.
    { leading: false }, // Do not fire immediately when called.
  );

  /**
   * If the component is being un-mounted, flush the throttle to make sure that any
   * unsaved changes are dispatched to the server that might be otherwise waiting for
   * the throttle timeout.
   */
  useEffect(() => () => throttledSave.flush(), []);

  /**
   * Upon mount, bind CRDT with outgoing and incoming update events.
   */
  useEffect(() => {
    ydoc.current.on('update', (_, origin) => {
      // Do not emit the updated CRDT if the latest update event was fired
      // by a remote client. (within the websocket event below.)
      if (origin !== `${thisOrigin.current}-${id}`) {
        return;
      }

      // Transmit CRDT update to other connected clients.
      socket?.emit('note-updated', id, Y.encodeStateAsUpdate(ydoc.current));

      // Trigger the auto save mechanism. Method is smart and will only save if necessary,
      // that too after a throttle.
      throttledSave();
    });

    socket?.on('incoming-note-update', (content) => {
      // Apply CRDT update from other clients.
      Y.applyUpdate(ydoc.current, new Uint8Array(content));
    });
  }, []);

  /**
   * Upon first load, initial value of the note is received as byte array (CRDT).
   * Load the CRDT to a blank YJS doc as a shared data type and return it.
   */
  const sharedType = useMemo(() => {
    Y.applyUpdate(ydoc.current, initialValue);
    const sharedType = ydoc.current.get('content', Y.XmlText) as Y.XmlText;

    // Initial value is the last saved value from the database. Set the value to track changes
    // made by this client that should be saved.
    setLastSavedContent(hash(yTextToSlateElement(sharedType)));

    return sharedType;
  }, [initialValue]);

  /**
   * Because the shared datatype is in the CRDT language and Slate doesn't understand it,
   * bind the type using the slate-yjs binding helper to convert it to slate's data.
   */
  const editor = useMemo(() => {
    if (sharedType) {
      return withReact(
        withYHistory(
          withYjs(createEditor(), sharedType, {
            localOrigin: `${thisOrigin.current}-${id}`,
          }),
        ),
      );
    }
  }, [sharedType]);

  /**
   * Initialize editor and sharedType's binding. This kinda acts like an event listener. Whenever
   * the sharedType is updated, the slate-yjs helper will automatically convert it to the editor's
   * format and update editor's children (content).
   */
  useEffect(() => {
    // If binding isn't ready yet, abort.
    if (!editor) {
      return;
    }

    YjsEditor.connect(editor);

    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  // Handle closure of SnackBars on this component.
  const handleClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // Reset save request's state.
    reset();
  };

  return (
    <>
      {(isLoading || isSuccess) && (
        <Box mb={1} sx={{ width: '100%', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <LinearProgress sx={{ width: '100%' }} />
          ) : (
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end', color: '#7c7c7c' }}>
              <DoneRoundedIcon color="success" /> Saved
            </Box>
          )}
        </Box>
      )}
      {editor && <PlateEditor editor={editor as unknown as PlateEditorType<MyValue>} />}
      <Snackbar
        open={isError}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose}>
          Failed saving your note. Please check your internet connection.
        </Alert>
      </Snackbar>
    </>
  );
};
