import React from 'react';
import { CursorOverlay, CursorOverlayProps } from '@udecode/plate';
import { cursorStore } from './cursorStore';

export const CursorOverlayContainer = ({ cursors, ...props }: CursorOverlayProps): JSX.Element => {
  const dynamicCursors = cursorStore.use.cursors();

  const allCursors = { ...cursors, ...dynamicCursors };

  return <CursorOverlay {...props} cursors={allCursors} />;
};
