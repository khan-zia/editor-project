import React from 'react';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { getPluginType, MARK_KBD, MarkToolbarButton } from '@udecode/plate';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const KbdToolbarButton = (): JSX.Element => {
  const editor = useMyPlateEditorRef();

  return <MarkToolbarButton type={getPluginType(editor, MARK_KBD)} icon={<KeyboardIcon />} />;
};
