import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { Note, NoteResponse } from '../../../backend/routes/notes';
import { ClientToServerEvents, ServerToClientEvents } from '../../../backend/socket';
export interface SocketState {
  /**
   * These notes represent items of the side bar menu. The menu items will be
   * updated in real time when an item's title is changed or when a new item
   * (note) is added.
   */
  notes: Array<Note>;

  /**
   * This is the note that's currently loaded by the SingleNote component.
   * State updates for collaborative editing.
   */
  note: undefined | NoteResponse;
}

export type SocketActionTypes = 'add_menu' | 'add_note' | 'update_title' | 'update_note' | 'update_current_title';

export interface SocketActions {
  type: SocketActionTypes;
  payload: string | Note | NoteResponse | Array<Note>;
}

// Define a default state
export const defaultSocketState: SocketState = {
  notes: [],
  note: undefined,
};

export const socketReducer = (state: SocketState, action: SocketActions): SocketState => {
  switch (action.type) {
    case 'add_menu':
      return { ...state, notes: action.payload as Array<Note> };

    case 'add_note':
      return { ...state, notes: [action.payload as Note, ...state.notes] };

    // Updates title for the side menu.
    case 'update_title':
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === (action.payload as Note).id ? (action.payload as Note) : n)),
      };

    case 'update_note':
      return { ...state, note: action.payload as NoteResponse };

    // Updates title for the SingleNote component to track title changes
    // for toggling the "save" button.
    case 'update_current_title':
      if (state.note) {
        return { ...state, note: { ...state.note, title: action.payload as string } };
      } else {
        return state;
      }

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
