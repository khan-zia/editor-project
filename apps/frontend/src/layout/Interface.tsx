import React, { useState } from 'react';
import { Toolbar, Typography, Drawer, Divider, Box, Container } from '@mui/material';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import { NotesList } from '../notes';
import NewNoteDialog from '../notes/NewNoteDialog';

const drawerWidth = 240;

interface InterfaceProps {
  activeNoteId?: string;
}

const Interface: React.FC<InterfaceProps> = ({ activeNoteId, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const addNewNote = () => {
    setOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar>
            <Typography data-cy="notes-logo" component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Notes
            </Typography>
            <NoteAddRoundedIcon
              fontSize="large"
              sx={{
                color: '#7c7c7c',
                '&:hover': {
                  color: '#3c3c3c',
                  cursor: 'pointer',
                },
              }}
              onClick={addNewNote}
              data-cy="add-note-button"
            />
          </Toolbar>
          <Divider />
          <NotesList activeNoteId={activeNoteId} />
          <Divider />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            backgroundColor: '#eee',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
      <NewNoteDialog open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Interface;
