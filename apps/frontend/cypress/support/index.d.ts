declare namespace EditorProject {
  interface CreateNewNote {
    title: string;
  }
}

type SnapShotOptions = {
  ignoreExtraFields?: boolean;
  ignoreExtraArrayItems?: boolean;
  normalizeJson?: boolean;
  replace?: {
    [key: string]: string;
  };
};

declare namespace Cypress {
  interface Chainable {
    /**
     * Patch cypress-plugin-snapshots when running all tests.
     *
     * @example
     * cy.fixCypressSpec();
     *
     * @see https://github.com/meinaart/cypress-plugin-snapshots/issues/10
     * @see https://github.com/cypress-io/cypress/issues/3090
     */
    fixCypressSpec(): void;

    /**
     * This command is from the "cypress-plugin-snapshots" plugin that
     * helps in validating content of the backend responses by asserting
     * against stored objects of value literals.
     */
    toMatchSnapshot: (options?: SnapShotOptions) => void;

    /**
     * Command to select DOM element by data-cy attribute. It also accepts any options as the second
     * parameter that are supported by the cy.get() method.
     *
     * @example cy.getByDataAttribute('hello', {timeout: 10000});
     */
    getByDataAttribute: (
      attribute: string,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>,
    ) => Chainable<JQuery<HTMLElement>>;

    /**
     * Command that runs the following commands for ease of use.
     * .should('exist').and('be.visible');
     *
     * It's a child command and must be chained off a parent command.
     *
     * @example
     * cy.get('something').canBeSeen()
     */
    canBeSeen: () => Chainable<JQuery<HTMLElement>>;

    /**
     * Command to create a new note directly via an API call.
     * If a title is not specified, it will use the "note" fixture to
     * create one.
     *
     * @example
     * cy.createNewNote();
     *
     * @example
     * cy.createNewNote({
     *   title: 'Awesome Note',
     * });
     */
    createNewNote: (data?: EditorProject.CreateNewNote | null) => Chainable<Element>;
  }
}
