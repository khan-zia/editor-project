import React from 'react';
import { getPluginType, MARK_HIGHLIGHT, MarkToolbarButton } from '@udecode/plate';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

const Highlight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#000000' }}>
    <path d="m20.707 5.826-3.535-3.533a.999.999 0 0 0-1.408-.006L7.096 10.82a1.01 1.01 0 0 0-.273.488l-1.024 4.437L4 18h2.828l1.142-1.129 3.588-.828c.18-.042.345-.133.477-.262l8.667-8.535a1 1 0 0 0 .005-1.42zm-9.369 7.833-2.121-2.12 7.243-7.131 2.12 2.12-7.242 7.131zM4 20h16v2H4z"></path>
  </svg>
);

export const HighlightToolbarButton = () => {
  const editor = useMyPlateEditorRef();

  return <MarkToolbarButton type={getPluginType(editor, MARK_HIGHLIGHT)} icon={<Highlight />} />;
};
