import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { NoteResponse } from './routes/notes';

type NotePayload = (note: NoteResponse) => void;

// Events that the Server will send to the Client.
export interface ServerToClientEvents {
  'incoming-new-note': NotePayload;
  'incoming-new-title': (title: string) => void;
}

// Events that Client will send to the Server.
export interface ClientToServerEvents {
  'new-note-created': NotePayload;
  'join-note': (noteID: string) => void;
  'note-title-updated': (id: string, title: string) => void;
}

export class ServerSocket {
  /** Reusable ServerSocket instance if already instantiated. */
  public static instance: ServerSocket;

  /** Socket.io Server handler. */
  public io: Server<ClientToServerEvents, ServerToClientEvents>;

  // Instantiate a server socket for connections.
  constructor(server: HttpServer) {
    ServerSocket.instance = this;

    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
      },
    });

    // Start all listeners upon successful connection.
    this.registerListeners();
  }

  /**
   * Begin all server side listeners.
   * Typically used when a fresh WS server is instantiated.
   */
  registerListeners = (): void => {
    // Listener for when a client establishes a connection.
    this.io.on('connection', (socket) => {
      console.log('SOCKET CONNECTED AS ' + socket.id);

      // When a new note creation is completed, broadcast it to all other clients.
      socket.on('new-note-created', (note) => {
        socket.broadcast.emit('incoming-new-note', note);
      });

      // When a client visits a specific note, let the client join that room.
      socket.on('join-note', (noteId) => socket.join(noteId));

      // When a note's title is updated
      socket.on('note-title-updated', (noteId, title) => {
        socket.to(noteId).emit('incoming-new-title', title);
      });
    });
  };
}
