// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import React, { useEffect, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { Alert, Box, LinearProgress, Snackbar } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { useServerRequest } from '../notes/hooks';
import PlateEditor from './Plate';
import { MyValue } from '../plate/typescript/plateTypes';

interface EditorProps {
  id: string;
  initialValue?: MyValue | undefined;
  placeholder?: string;
}

export const Editor: React.FC<EditorProps> = ({ id, initialValue }) => {
  const {
    executeRequest: saveNote,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useServerRequest('put', `api/notes/${id}/content`);
  const [updatedContent, setUpdatedContent] = useState<string | undefined>(undefined);
  /**
   * Handle saving the note automatically when there are changes.
   * Auto-saving is throttled to reduce network load. Currently, once every 15 secs.
   */
  const throttledSave = useThrottledCallback(
    () => {
      // If "updatedContent" is undefined or is exactly the same as the "initialValue",
      // that means there has been no change.
      if (!updatedContent || updatedContent === JSON.stringify(initialValue)) {
        return;
      }

      // Process saving updated content.
      saveNote({ content: updatedContent });
    },
    12000, // Save once every 12 seconds.
    { leading: false }, // Do not fire immediately when called.
  );

  /**
   * If the component is being un-mounted, flush the throttle to make sure that any
   * unsaved changes are dispatched to the server that might be otherwise waiting for
   * the throttle timeout.
   */
  useEffect(() => () => throttledSave.flush(), []);

  // Handle changes for content of the editor.
  // const onChange = (value: Descendant[]) => {
  const onChange = (value: MyValue) => {
    const content = JSON.stringify(value);
    setUpdatedContent(content);

    // socket?.emit('note-updated', id, content);

    // Invoke auto-save upon changes.
    throttledSave();
  };

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
        <Box mt={1} style={{ width: '100%', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <LinearProgress sx={{ width: '100%' }} />
          ) : (
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end', color: '#7c7c7c' }}>
              <DoneRoundedIcon color="success" /> Saved
            </Box>
          )}
        </Box>
      )}
      <PlateEditor initialValue={initialValue} onChange={onChange} />
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
