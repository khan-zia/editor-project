import React from 'react';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignJustifyRoundedIcon from '@mui/icons-material/FormatAlignJustifyRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import { AlignToolbarButton } from '@udecode/plate';

export const AlignToolbarButtons = (): JSX.Element => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeftRoundedIcon />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenterRoundedIcon />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRightRoundedIcon />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustifyRoundedIcon />} />
    </>
  );
};
