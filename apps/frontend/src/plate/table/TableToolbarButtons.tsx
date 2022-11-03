import React from 'react';

import BorderAllRoundedIcon from '@mui/icons-material/BorderAllRounded';
import BorderClearRoundedIcon from '@mui/icons-material/BorderClearRounded';
import BorderBottomRoundedIcon from '@mui/icons-material/BorderBottomRounded';
import BorderTopRoundedIcon from '@mui/icons-material/BorderTopRounded';
import BorderLeftRoundedIcon from '@mui/icons-material/BorderLeftRounded';
import BorderRightRoundedIcon from '@mui/icons-material/BorderRightRounded';

import {
  deleteColumn,
  deleteRow,
  deleteTable,
  insertTable,
  insertTableColumn,
  insertTableRow,
  TableToolbarButton,
} from '@udecode/plate';

export const TableToolbarButtons = (): JSX.Element => (
  <>
    <TableToolbarButton icon={<BorderAllRoundedIcon />} transform={insertTable} />
    <TableToolbarButton icon={<BorderClearRoundedIcon />} transform={deleteTable} />
    <TableToolbarButton icon={<BorderBottomRoundedIcon />} transform={insertTableRow} />
    <TableToolbarButton icon={<BorderTopRoundedIcon />} transform={deleteRow} />
    <TableToolbarButton icon={<BorderLeftRoundedIcon />} transform={insertTableColumn} />
    <TableToolbarButton icon={<BorderRightRoundedIcon />} transform={deleteColumn} />
  </>
);
