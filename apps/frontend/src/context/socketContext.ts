import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { Note } from '../../../backend/routes/notes';
import { ClientToServerEvents, ServerToClientEvents } from '../../../backend/socket';

type NoteWithoutContent = Omit<Note, 'content'>;

export interface SocketState {
  /**
   * These notes represent items of the side bar menu. The menu items will be
   * updated in real time when an item's title is changed or when a new item
   * (note) is added.
   */
  notes: NoteWithoutContent[];
}

export type SocketActionTypes = 'add_menu' | 'add_note' | 'update_title';

export interface SocketActions {
  type: SocketActionTypes;
  payload: string | Uint8Array | NoteWithoutContent | NoteWithoutContent[];
}

// Define a default state
export const defaultSocketState: SocketState = {
  notes: [],
};

export const socketReducer = (state: SocketState, action: SocketActions): SocketState => {
  switch (action.type) {
    // Loads notes for the initial render on the side bar.
    // Ties the side bar to real time updates for adding new notes and notes title changes.
    case 'add_menu':
      return { ...state, notes: action.payload as NoteWithoutContent[] };

    // Adds title of the new note to the side bar menu.
    case 'add_note':
      return { ...state, notes: [action.payload as NoteWithoutContent, ...state.notes] };

    // Updates title for the sidebar menu.
    case 'update_title':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === (action.payload as NoteWithoutContent).id ? (action.payload as NoteWithoutContent) : n,
        ),
      };

    default:
      return state;
  }
};

export interface SocketContextProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  socketState: SocketState;
  socketDispatch: React.Dispatch<SocketActions>;
}

const SocketContext = createContext<SocketContextProps>({
  socket: undefined,
  socketState: defaultSocketState,
  socketDispatch: () => undefined,
});

export const useSocketContext = (): SocketContextProps => useContext(SocketContext);

export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
