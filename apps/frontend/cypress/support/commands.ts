/// <reference path="../support/index.d.ts" />

Cypress.Commands.add('getByDataAttribute', (attribute, options) => {
  cy.get(`[data-cy='${attribute}']`, options);
});

Cypress.Commands.add('canBeSeen', { prevSubject: true }, (subject: Cypress.Chainable<Element>) => {
  cy.wrap(subject).should('exist').and('be.visible');
});

Cypress.Commands.add('createNewNote', (data = null) => {
  cy.fixture('note').then((note) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/api/notes',
      headers: {
        Accept: 'application/json',
      },
      body: data ?? { title: note.title },
    }).then((response) => {
      // response.body
    });
  });
});

// To satisfy the --isolatedModules. Even if the compiler option for isolatedModules is set to false in tsconfig,
// NextJS will reset it to true on each build internally.
export {};
