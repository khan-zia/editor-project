import { basename } from 'path';

Cypress.Commands.add('fixCypressSpec', function () {
  /** @ts-ignore */
  const { absoluteFile, relativeFile } = this.test.invocationDetails;

  Cypress.spec = {
    ...Cypress.spec,
    absolute: absoluteFile,
    name: basename(absoluteFile),
    relative: relativeFile,
  };
});
