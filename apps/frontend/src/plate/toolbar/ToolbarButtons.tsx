import React from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FontDownloadRoundedIcon from '@mui/icons-material/FontDownloadRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import LineWeightRoundedIcon from '@mui/icons-material/LineWeightRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';
import { TippyProps } from '@tippyjs/react';
import {
  ColorPickerToolbarDropdown,
  ImageToolbarButton,
  LineHeightToolbarDropdown,
  LinkToolbarButton,
  MARK_BG_COLOR,
  MARK_COLOR,
  MediaEmbedToolbarButton,
} from '@udecode/plate';
import { AlignToolbarButtons } from '../align/AlignToolbarButtons';
import { BasicElementToolbarButtons } from '../basic-elements/BasicElementToolbarButtons';
import { BasicMarkToolbarButtons } from '../basic-marks/BasicMarkToolbarButtons';
import { IndentToolbarButtons } from '../indent/IndentToolbarButtons';
import { ListToolbarButtons } from '../list/ListToolbarButtons';
import { TableToolbarButtons } from '../table/TableToolbarButtons';

export const ToolbarButtons = (): JSX.Element => {
  const colorTooltip: TippyProps = { content: 'Text color' };
  const bgTooltip: TippyProps = { content: 'Text color' };

  return (
    <>
      <BasicElementToolbarButtons />
      <ListToolbarButtons />
      <IndentToolbarButtons />
      <BasicMarkToolbarButtons />
      <ColorPickerToolbarDropdown
        pluginKey={MARK_COLOR}
        icon={<FormatColorTextRoundedIcon />}
        selectedIcon={<CheckRoundedIcon />}
        tooltip={colorTooltip}
      />
      <ColorPickerToolbarDropdown
        pluginKey={MARK_BG_COLOR}
        icon={<FontDownloadRoundedIcon />}
        selectedIcon={<CheckRoundedIcon />}
        tooltip={bgTooltip}
      />
      <LineHeightToolbarDropdown icon={<LineWeightRoundedIcon />} />
      <AlignToolbarButtons />
      <LinkToolbarButton icon={<LinkRoundedIcon />} />
      <ImageToolbarButton icon={<ImageRoundedIcon />} />
      <MediaEmbedToolbarButton icon={<OndemandVideoRoundedIcon />} />
      <TableToolbarButtons />
    </>
  );
};
