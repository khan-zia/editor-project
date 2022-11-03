import { api } from '../schema';

describe("Navigating to an individual note and being able to update it's title.", () => {
  beforeEach(() => {
    // Let's isolate each test, create a note via the API directly and that
    // way we know that we can use cypress to navigate to it. This will ensure
    // that each test does not depend on the availability of previous notes.
    cy.createNewNote();

    // Visit the main page.
    cy.visit('/');

    // We know that by now at least one note sidebar title must exist. However,
    // there could be many, so just pick the first one.
    cy.getByDataAttribute('note-sidebar-title').first().canBeSeen().click();
  });

  it("Can navigate to a note's page.", () => {
    // Browser should have navigated to a note's page.
    const base = Cypress.config().baseUrl + '/notes/';
    cy.url()
      .should('include', base)
      .then((url) => {
        // Note's ID is expected to be a 20 chars alphanumeric string.
        expect(new RegExp('^[a-zA-Z0-9]{20}$').test(url.replace(base, ''))).to.be.true;
      });

    // On this page, note should be loading.
    cy.getByDataAttribute('note-loading-state').canBeSeen();

    // After loading, note's title and editor should be visible and the loading state
    // should not.
    cy.getByDataAttribute('note-title-field').canBeSeen();
    cy.getByDataAttribute('note-editor').canBeSeen();
    cy.getByDataAttribute('note-loading-state').should('not.exist');
  });

  it("Can update a note's title.", () => {
    // Grab note's ID from the URL. We need it to spy on the title update request.
    cy.url()
      .should('include', '/notes')
      .then((url) => {
        // Because we know exactly what comes before the ID in the URL.
        const noteID = url.replace(Cypress.config().baseUrl + '/notes/', '');

        // Spy on the update request.
        cy.intercept(
          {
            method: 'PUT',
            url: `http://localhost:3001/api/notes/${noteID}/title`,
          },

          // Assert that the frontend sends an expected payload to the server.
          (request) => api.assertSchema('UpdateTitleRequest', '1.0.0')(request.body),
        ).as('updateTitleRequest');
      });

    // The title "save" button should not be visible by default.
    cy.getByDataAttribute('title-save-button').should('not.exist');

    // But as soon the title is changed, a "save" button should appear,
    // Increasing the default timeout to 10s because it initially loads over websocket
    // and the test fails sometimes with the default 4 seconds.
    cy.getByDataAttribute('note-title-field', { timeout: 10000 }).type('{moveToEnd} Z');
    cy.getByDataAttribute('title-save-button').canBeSeen();

    // If user removes changes to the title, the save button should disappear again.
    cy.getByDataAttribute('note-title-field').type('{backspace}{backspace}');
    cy.getByDataAttribute('title-save-button').should('not.exist');

    // Change the title again and save it this time.
    cy.getByDataAttribute('note-title-field').type('{moveToEnd} Updated.');
    cy.getByDataAttribute('title-save-button').click();

    // When updating the title completes, assert against the response.
    cy.wait('@updateTitleRequest')
      .its('response')
      .then(({ body, statusCode }) => {
        expect(statusCode).to.eq(200);

        // Asserts json schema structure. Response body must be the same
        // as the expected json schema.
        api.assertSchema('UpdateTitleSuccess', '1.0.0')(body);
      });
  });
});
