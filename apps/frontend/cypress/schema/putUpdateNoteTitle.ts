import { ObjectSchema, versionSchemas } from '@cypress/schema-tools';
import { strictProperties } from './helpers';

type Request = {
  title: string;
};

const RequestExample: Request = {
  title: 'Awesome Note',
};

const Request: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    title: 'UpdateTitleRequest',
    type: 'object',
    description: "The payload sent to the backend for updating a note's title.",
    properties: {
      title: {
        type: 'string',
        description: 'New title of the note.',
      },
    },
    ...strictProperties,
  },
  example: RequestExample,
};

type UpdateTitleFailureResponse = {
  success: false;
};

// This example will be shown in the cypress console in case backend returns
// an expected value.
const UpdateTitleFailureExample: UpdateTitleFailureResponse = {
  success: false,
};

const UpdateTitleFailureResponse: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    title: 'UpdateTitleFailure',
    type: null,
    description: 'Response of the backend when updating a note title fails.',
    properties: {
      success: {
        type: 'boolean',
        description: 'Status of the update title request.',
      },
    },
    ...strictProperties,
  },
  example: UpdateTitleFailureExample,
};

// When a title is successfully updated, what will the backend's response look like?
// It simply returns "true" for the purpose of this test.
type UpdateTitleSuccessResponse = {
  success: true;
};

const UpdateTitleSuccessExample: UpdateTitleSuccessResponse = {
  success: true,
};

export const UpdateTitleSuccessResponse: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    title: 'UpdateTitleSuccess',
    description: 'Payload of the backend response when a note title is successfully updated.',
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Status of the update title request.',
      },
    },
    ...strictProperties,
  },
  example: UpdateTitleSuccessExample,
};

export const UpdateTitleRequest = versionSchemas(Request);
export const UpdateTitleFailure = versionSchemas(UpdateTitleFailureResponse);
export const UpdateTitleSuccess = versionSchemas(UpdateTitleSuccessResponse);
