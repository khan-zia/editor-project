import React from 'react';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignJustifyRoundedIcon from '@mui/icons-material/FormatAlignJustifyRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';

// import { FormatAlignCenter } from '@styled-icons/material/FormatAlignCenter';
// import { FormatAlignJustify } from '@styled-icons/material/FormatAlignJustify';
// import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft';
// import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight';
import { AlignToolbarButton } from '@udecode/plate';

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeftRoundedIcon />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenterRoundedIcon />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRightRoundedIcon />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustifyRoundedIcon />} />
      {/* <AlignToolbarButton value="left" icon={<FormatAlignLeft />} /> */}
      {/* <AlignToolbarButton value="center" icon={<FormatAlignCenter />} /> */}
      {/* <AlignToolbarButton value="right" icon={<FormatAlignRight />} /> */}
      {/* <AlignToolbarButton value="justify" icon={<FormatAlignJustify />} /> */}
    </>
  );
};
