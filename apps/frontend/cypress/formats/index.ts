import { CustomFormat } from '@cypress/schema-tools';

const NoteID: CustomFormat = {
  name: 'NoteID',
  description: 'ID of a note. It is expected to be exactly 20 chars long and alphanumeric.',
  detect: /^[a-zA-Z0-9]{20}$/,
  defaultValue: '1JrclVI6sP3zw03xs3m7',
};

type DefinedFormats = {
  NoteID: CustomFormat;
};

export const Formats: DefinedFormats = {
  NoteID,
};
