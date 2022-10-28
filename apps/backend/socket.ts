import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

type NoteSocketPayload = (noteId: string, noteTitle: string) => void;

// Events that the Server will send to the Client.
export interface ServerToClientEvents {
  'incoming-new-note': NoteSocketPayload;
  'incoming-new-title': (noteId: string, title: string) => void;
}

// Events that Client will send to the Server.
export interface ClientToServerEvents {
  'join-note': (noteID: string) => void;
  'new-note-created': NoteSocketPayload;
  'note-title-updated': NoteSocketPayload;
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
        origin: 'http://localhost:3000', // Todo: This would typically come from an env.
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
      // When a new note creation is completed, broadcast it to all other clients.
      socket.on('new-note-created', (noteId, noteTitle) => {
        socket.broadcast.emit('incoming-new-note', noteId, noteTitle);
      });

      // When a client visits a specific note, let the client join that room.
      socket.on('join-note', (noteId) => socket.join(noteId));

      // When a note's title is updated,
      socket.on('note-title-updated', (noteId, title) => {
        // send the event to all connected clients. (To update the title on the side menu)
        this.io.emit('incoming-new-title', noteId, title);
      });
    });
  };
}
