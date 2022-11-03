import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { fetchNote } from './routes/notes';

type NoteSocketPayload = (noteId: string, noteTitle: string) => void;

// Events that the Server will send to the Client.
export interface ServerToClientEvents {
  'incoming-new-note': NoteSocketPayload;
  'incoming-new-title': NoteSocketPayload;
  'incoming-note-update': (content: ArrayBuffer) => void;
}

// Events that Client will send to the Server.
export interface ClientToServerEvents {
  'join-note': (noteID: string, response: (title: string | null, content: ArrayBuffer | null) => void) => void;
  'new-note-created': NoteSocketPayload;
  'note-title-updated': NoteSocketPayload;
  'note-updated': (noteId: string, content: ArrayBuffer) => void;
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
    this.io.on('connection', (socket) => {
      /**
       * When a new note is created, broadcast it to all other clients.
       */
      socket.on('new-note-created', (noteId, noteTitle) => {
        console.log(noteId, noteTitle);
        socket.broadcast.emit('incoming-new-note', noteId, noteTitle);
      });

      /**
       * When a client visits a specific note, let the client join that room,
       * and fetch note's initial value from the database if any.
       */
      socket.on('join-note', async (noteId, response) => {
        // Join room.
        socket.join(noteId);

        // Fetch note's content.
        const note = await fetchNote(noteId);

        // If note could be fetched.
        if (note) {
          // Send it back over the same socket as response.
          response(note.title, note.content);
          return;
        }

        // Otherwise simply respond with "null" values
        response(null, null);
      });

      /**
       * When a note's title is updated, send the event to all connected (including current client).
       * This is to update the title on the side bar menu in real time.
       */
      socket.on('note-title-updated', (noteId, title) => {
        this.io.emit('incoming-new-title', noteId, title);
      });

      // When a note's content is updated,
      socket.on('note-updated', (noteId, content) => {
        // transmit the change in real time to all other clients viewing the same note.
        // These are clients that have joined the note's "room".
        socket.to(noteId).emit('incoming-note-update', content);
      });
    });
  };
}
