import { defineConfig } from 'cypress';
import { initPlugin } from 'cypress-plugin-snapshots/plugin';
import { io, Socket } from 'socket.io-client';

export default defineConfig({
  viewportWidth: 3840,
  viewportHeight: 2160,
  env: {},
  experimentalStudio: true,
  e2e: {
    setupNodeEvents(on, config) {
      /**
       * A Cypress task that will connect to the websocket server to act as the second user
       * emitting events over the socket. These events will go to the actual server and
       * the server will emit further to other clients. Because Cypress's test runner will also
       * be a client, therefore, we can observe and assert features there.
       */
      let socket: Socket;

      on('task', {
        connectSocket() {
          socket = io('ws://localhost:3001');
          return null;
        },

        newNoteCreated([id, title]) {
          socket.emit('new-note-created', id, title);
          return null;
        },

        noteTitleUpdated([id, title]) {
          socket.emit('note-title-updated', id, title);
          return null;
        },
      });

      // return null;

      // Setup snapshots plugin.
      return initPlugin(on, config);
    },
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
});
