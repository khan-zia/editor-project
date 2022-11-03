/**
 * TO LEARN HOW THESE TESTS WORK,
 * read the docs at cypress.config.ts
 */
describe('Testing real time features such adding new note and updating a title.', () => {
  it("It can add and update a note's title in sidebar menu in real time.", () => {
    // Visit the main page.
    cy.visit('/');

    // Connect a new user to the actual WS server.
    cy.task('connectSocket');

    cy.getByDataAttribute('note-sidebar-title').then((elements) => {
      // Length of the notes titles in the sidebar before.
      const len = elements.length;

      // Force the server to emit a new note event.
      cy.task('newNoteCreated', ['abc1234567890', 'An Awesome Note!']);

      // Length should have increased by one and the new title must be the first item.
      // Also title must match.
      cy.getByDataAttribute('note-sidebar-title')
        .should('have.length', len + 1)
        .first()
        .then((ele) => expect(ele.text()).to.be.eq('An Awesome Note!'));
    });
    // Next, let's force the server to emit a title update event for the same note.
    // We know its ID because we just used it above.
    cy.task('noteTitleUpdated', ['abc1234567890', 'An Awesome Note Updated!']);

    // Wait for a minimal time to allow the websocket to update the UI.
    cy.wait(100);

    // The note's title in the sidebar should also be updated.
    cy.getByDataAttribute('note-sidebar-title')
      .first()
      .then((ele) => expect(ele.text()).to.be.eq('An Awesome Note Updated!'));
  });

  it("It can update a note's title in real time while viewing that particular note.", () => {
    // Let's a create a real note directly using the API.
    cy.createNewNote();

    // Visit the main page.
    cy.visit('/');

    const updatedTitleForTheTest = 'Title was updated by the test.';

    // And then navigate to the note's page. We know it will always be the first one in sidebar.
    // While we are at it, also let's make sure that the note's current title in the sidebar
    // is not already what we will use for this test.
    cy.getByDataAttribute('note-sidebar-title')
      .first()
      .then((ele) => {
        expect(ele.text()).to.not.eq(updatedTitleForTheTest);
        cy.wrap(ele).click();
      });

    // Next, let's grab note's ID from the URL.
    cy.url({ timeout: 10000 })
      .should('include', '/notes')
      .then((url) => {
        // Because we know exactly what comes before the ID in the URL.
        const noteID = url.replace(Cypress.config().baseUrl + '/notes/', '');

        // Next, let's also make sure the note's title field also doesn't already display
        // the same title that we intend to use for the purpose of this test.
        cy.get('input[name="note-title-field"]', { timeout: 10000 })
          .invoke('val')
          .then((val) => expect(val).to.not.eq(updatedTitleForTheTest));

        // Force the server to emit an update for this note's title.
        cy.task('noteTitleUpdated', [noteID, updatedTitleForTheTest]);
      });

    // Allow a minimal wait for the websocket to update the UI.
    cy.wait(100);

    // Note's title should be updated now in both places, the sidebar menu and the note's title
    // field.
    cy.get('input[name="note-title-field"]')
      .invoke('val')
      .then((val) => expect(val).to.be.eq(updatedTitleForTheTest));

    cy.getByDataAttribute('note-sidebar-title')
      .first()
      .then((ele) => expect(ele.text()).to.be.eq(updatedTitleForTheTest));
  });
});
