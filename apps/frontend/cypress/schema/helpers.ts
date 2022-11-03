type StrictProperties = {
  required: true | string[];
  additionalProperties: boolean;
};

export const strictProperties: StrictProperties = {
  // Mark all properties inside the "schema" block as required.
  // Those all must be sent in the payload by the frontend.
  required: true,

  // Do not expect any extra properties that are not mentioned inside the "schema" block
  // to be present in the payload sent by the frontend.
  additionalProperties: false,
};
