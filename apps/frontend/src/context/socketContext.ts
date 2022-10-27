import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { NoteResponse } from '../../../backend/routes/notes';
import { ClientToServerEvents, ServerToClientEvents } from '../../../backend/socket';

export interface SocketState {
  notes: Array<NoteResponse>;
  newNoteCreated: undefined | NoteResponse;
  note: undefined | NoteResponse;
}

export type SocketActionTypes = 'new_note' | 'new_note_broadcasted' | 'update_note' | 'update_title' | 'update_notes';

export interface SocketActions {
  type: SocketActionTypes;
  payload: unknown;
}

// Define a default state
export const defaultSocketState: SocketState = {
  notes: [],
  newNoteCreated: undefined,
  note: undefined,
};

export const SocketReducer = (state: SocketState, action: SocketActions): SocketState => {
  switch (action.type) {
    case 'new_note':
      return { ...state, newNoteCreated: action.payload as SocketState['newNoteCreated'] };
    case 'new_note_broadcasted':
      return { ...state, newNoteCreated: undefined };
    case 'update_note':
      return { ...state, note: action.payload as NoteResponse };
    case 'update_title':
      if (state.note) {
        return { ...state, note: { ...state.note, title: action.payload as string } };
      } else {
        return state;
      }
    case 'update_notes':
      return { ...state, notes: [...state.notes, action.payload as NoteResponse] };
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
