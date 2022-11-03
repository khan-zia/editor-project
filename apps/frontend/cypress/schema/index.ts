import { SchemaCollection, bind, combineSchemas } from '@cypress/schema-tools';
import { CreateNewNoteRequest, CreateNewNoteSuccess } from './postCreateNewNote';
import { Formats as formats } from '../formats';
import { UpdateTitleFailure, UpdateTitleRequest, UpdateTitleSuccess } from './putUpdateNoteTitle';

export const schemas: SchemaCollection = combineSchemas(
  CreateNewNoteRequest,
  CreateNewNoteSuccess,
  UpdateTitleRequest,
  UpdateTitleFailure,
  UpdateTitleSuccess,
);

export const api = bind({ schemas, formats });
