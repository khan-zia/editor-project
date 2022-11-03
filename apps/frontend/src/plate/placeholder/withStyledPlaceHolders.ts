import {
  DefaultPlatePluginKey,
  ELEMENT_H1,
  ELEMENT_PARAGRAPH,
  PlatePluginComponent,
  withPlaceholders,
} from '@udecode/plate';

export const withStyledPlaceHolders = (
  components: unknown,
): Record<DefaultPlatePluginKey, PlatePluginComponent<unknown>> =>
  withPlaceholders(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type a paragraph',
      hideOnBlur: true,
    },
    {
      key: ELEMENT_H1,
      placeholder: 'Untitled',
      hideOnBlur: false,
    },
  ]);
