import React from 'react';
import FormatIndentDecreaseRoundedIcon from '@mui/icons-material/FormatIndentDecreaseRounded';
import FormatIndentIncreaseRoundedIcon from '@mui/icons-material/FormatIndentIncreaseRounded';
import { indent, outdent, ToolbarButton } from '@udecode/plate';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const IndentToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ToolbarButton
        onMouseDown={(e) => {
          if (!editor) return;

          outdent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentDecreaseRoundedIcon />}
      />
      <ToolbarButton
        onMouseDown={(e) => {
          if (!editor) return;

          indent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentIncreaseRoundedIcon />}
      />
    </>
  );
};
