// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Descendant, BaseEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import { useThrottledCallback } from 'use-debounce';
import { Alert, Box, LinearProgress, Snackbar } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { handleHotkeys } from './helpers';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
import { EditorToolbar } from './EditorToolbar';
import { CustomElement } from './CustomElement';
import { CustomLeaf, CustomText } from './CustomLeaf';
import { useServerRequest } from '../notes/hooks';

// Slate suggests overwriting the module to include the ReactEditor, Custom Elements & Text
// https://docs.slatejs.org/concepts/12-typescript
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface EditorProps {
  id: string;
  initialValue?: Descendant[];
  placeholder?: string;
}

export const Editor: React.FC<EditorProps> = ({ id, initialValue = [], placeholder }) => {
  const {
    executeRequest: saveNote,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useServerRequest('put', `api/notes/${id}/content`);
  const [updatedContent, setUpdatedContent] = useState<string | undefined>(undefined);
  const renderElement = useCallback((props) => <CustomElement {...props} />, []);
  const renderLeaf = useCallback((props) => <CustomLeaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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
    15000, // Save once every 15 seconds.
    { leading: false }, // Do not fire immediately when called.
  );

  /**
   * If the component is being un-mounted, flush the throttle to make sure that any
   * unsaved changes are dispatched to the server that might be otherwise waiting for
   * the throttle timeout.
   */
  useEffect(() => () => throttledSave.flush(), []);

  // Handle changes for content of the editor.
  const onChange = (value: Descendant[]) => {
    // Ignore selections.
    const contentChanged = editor.operations.some((op) => 'set_selection' !== op.type);
    if (contentChanged) {
      // Stringify and store the current content.
      const content = JSON.stringify(value);
      setUpdatedContent(content);

      // socket?.emit('note-updated', id, content);

      // Invoke auto-save upon changes.
      throttledSave();
    }
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
      <Slate editor={editor} value={initialValue} onChange={onChange}>
        <EditorToolbar />
        {(isLoading || isSuccess) && (
          <Box mt={1} style={{ width: '100%', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
            {isLoading ? (
              <LinearProgress sx={{ width: '100%' }} />
            ) : (
              <Box
                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end', color: '#7c7c7c' }}
              >
                <DoneRoundedIcon color="success" /> Saved
              </Box>
            )}
          </Box>
        )}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          onKeyDown={handleHotkeys(editor)}
          // The dev server injects extra values to the editr and the console complains
          // so we override them here to remove the message
          autoCapitalize="false"
          autoCorrect="false"
          spellCheck="false"
        />
      </Slate>
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
