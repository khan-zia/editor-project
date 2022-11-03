import { ObjectSchema, versionSchemas } from '@cypress/schema-tools';
import { strictProperties } from './helpers';
import { Formats } from '../formats';

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
    title: 'CreateNewNoteRequest',
    type: 'object',
    description: 'The payload sent to the backend creating a new note.',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the note.',
      },
    },
    ...strictProperties,
  },
  example: RequestExample,
};

// What will the backend return if creating a note fails.
// typically an object but our backend returns just "null" for this demo.
type NoteCreationFailureResponse = null;

const NoteCreationFailureExample: NoteCreationFailureResponse = null;

const NoteCreationFailureResponse: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    title: 'CreateNewNoteFailure',
    type: null,
    description: 'Response of the backend when creating a new note fails.',
    ...strictProperties,
  },
  example: NoteCreationFailureExample,
};

// When the backend succeeds creating a new note, what will the response look like?
// It returns ID and title of the newly created note.
type NoteCreationSuccessResponse = {
  id: string;
  title: string;
};

const SuccessResponseExample: NoteCreationSuccessResponse = {
  id: '1JrclVI6sP3zw03xs3m7',
  title: 'Awesome Note',
};

export const NoteCreationSuccessResponse: ObjectSchema = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    title: 'CreateNewNoteSuccess',
    description: 'Payload of the backend response upon successful creation of a new note.',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the newly created noted.',
        format: Formats.NoteID.name, // This will check the ID against the regex defined in the format.
      },
      title: {
        type: 'string',
        description: 'Title of the newly created note.',
      },
    },
    ...strictProperties,
  },
  example: SuccessResponseExample,
};

export const CreateNewNoteRequest = versionSchemas(Request);
export const CreateNewNoteFailure = versionSchemas(NoteCreationFailureResponse);
export const CreateNewNoteSuccess = versionSchemas(NoteCreationSuccessResponse);
