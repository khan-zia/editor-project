import React, { useEffect } from 'react';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { useNotesList } from './hooks';
import { useSocketContext } from '../context/socketContext';

interface NotesListProps {
  activeNoteId?: string;
}

const NotesList: React.FC<NotesListProps> = ({ activeNoteId }) => {
  const { notesList } = useNotesList();

  /**
   * If a new note is added by other clients, we need to add that note to the side bar
   * menu in real time.
   *
   * If a note's title is updated by other clients. We need to update that
   * title in the menu in real time.
   */
  const {
    socketState: { notes },
    socketDispatch,
  } = useSocketContext();

  useEffect(() => {
    if (notesList && notesList !== notes) {
      socketDispatch({
        type: 'add_menu',
        payload: notesList,
      });
    }
  }, [notesList]);

  return (
    <List>
      {notes?.map((note) => (
        <Link href={`/notes/${note.id}`} key={note.id}>
          <ListItemButton selected={note.id === activeNoteId}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={note.title} />
          </ListItemButton>
        </Link>
      ))}
    </List>
  );
};

export default NotesList;
