import React from 'react';

import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import LooksOneRoundedIcon from '@mui/icons-material/LooksOneRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import Looks6RoundedIcon from '@mui/icons-material/Looks6Rounded';

import {
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  getPluginType,
  useEventPlateId,
} from '@udecode/plate';
import { useMyPlateEditorRef } from '../typescript/plateTypes';

// This is an SVG icon.
const CodeBlock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    // style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
    style={{ fill: '#000000' }}
  >
    <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z"></path>
    <path d="M9.293 9.293 5.586 13l3.707 3.707 1.414-1.414L8.414 13l2.293-2.293zm5.414 0-1.414 1.414L15.586 13l-2.293 2.293 1.414 1.414L18.414 13z"></path>
  </svg>
);

export const BasicElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef(useEventPlateId());

  return (
    <>
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon={<LooksOneRoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon={<LooksTwoRoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon={<Looks3RoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H4)} icon={<Looks4RoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H5)} icon={<Looks5RoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H6)} icon={<Looks6RoundedIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_BLOCKQUOTE)} icon={<FormatQuoteRoundedIcon />} />
      <CodeBlockToolbarButton type={getPluginType(editor, ELEMENT_CODE_BLOCK)} icon={<CodeBlock />} />
    </>
  );
};
