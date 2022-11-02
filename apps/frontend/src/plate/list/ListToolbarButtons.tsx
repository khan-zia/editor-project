import React from 'react';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import { ELEMENT_OL, ELEMENT_UL, getPluginType, ListToolbarButton } from '@udecode/plate';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

export const ListToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ListToolbarButton type={getPluginType(editor, ELEMENT_UL)} icon={<FormatListBulletedRoundedIcon />} />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_OL)} icon={<FormatListNumberedRoundedIcon />} />
    </>
  );
};
