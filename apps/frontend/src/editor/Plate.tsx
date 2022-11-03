import React, { useMemo } from 'react';
import {
  AutoformatPlugin,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createComboboxPlugin,
  createDeserializeCsvPlugin,
  createDeserializeDocxPlugin,
  createDeserializeMdPlugin,
  createExitBreakPlugin,
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createIndentPlugin,
  createItalicPlugin,
  createKbdPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createMentionPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  Plate,
  PlateEditor as PlateEditorType,
  createPlateEditor,
  PlateProvider,
} from '@udecode/plate';

import { basicNodesPlugins } from '../plate/basic-nodes/basicNodesPlugins';
import { createJuicePlugin } from '@udecode/plate-juice';
import { alignPlugin } from '../plate/align/alignPlugin';
import { autoformatPlugin } from '../plate/autoformat/autoformatPlugin';
import { MarkBalloonToolbar } from '../plate/balloon-toolbar/MarkBalloonToolbar';
import { editableProps } from '../plate/common/editableProps';
import { dragOverCursorPlugin } from '../plate/cursor-overlay/dragOverCursorPlugin';
import { exitBreakPlugin } from '../plate/exit-break/exitBreakPlugin';
import { indentPlugin } from '../plate/indent/indentPlugin';
import { linkPlugin } from '../plate/link/linkPlugin';
import { resetBlockTypePlugin } from '../plate/reset-node/resetBlockTypePlugin';
import { selectOnBackspacePlugin } from '../plate/select-on-backspace/selectOnBackspacePlugin';
import { softBreakPlugin } from '../plate/soft-break/softBreakPlugin';
import { Toolbar } from '../plate/toolbar/Toolbar';
import { createMyPlugins, MyEditor, MyPlatePlugin, MyValue } from '../plate/typescript/plateTypes';
import { ToolbarButtons } from '../plate/toolbar/ToolbarButtons';
import { withStyledPlaceHolders } from '../plate/placeholder/withStyledPlaceHolders';

let components = createPlateUI({});
components = withStyledPlaceHolders(components);

type PlateEditorProps = {
  editor: PlateEditorType<MyValue>;
  initialValue?: MyValue | undefined;
};

export const plugins = createMyPlugins(
  [
    ...basicNodesPlugins,
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createTodoListPlugin(),
    createHeadingPlugin(),
    createImagePlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin(linkPlugin),
    createListPlugin(),
    createTablePlugin(),
    createMediaEmbedPlugin(),
    createCodeBlockPlugin(),
    createAlignPlugin(alignPlugin),
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createHighlightPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createKbdPlugin(),
    createNodeIdPlugin(),
    dragOverCursorPlugin,
    createIndentPlugin(indentPlugin),
    createAutoformatPlugin<AutoformatPlugin<MyValue, MyEditor>, MyValue, MyEditor>(autoformatPlugin),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(softBreakPlugin),
    createExitBreakPlugin(exitBreakPlugin),
    createSelectOnBackspacePlugin(selectOnBackspacePlugin),
    createComboboxPlugin(),
    createMentionPlugin(),
    createDeserializeMdPlugin(),
    createDeserializeCsvPlugin(),
    createDeserializeDocxPlugin(),
    createJuicePlugin() as MyPlatePlugin,
  ],
  { components },
);

const PlateEditor: React.FC<PlateEditorProps> = ({ editor }) => {
  const e = useMemo(() => {
    return createPlateEditor({ editor, plugins });
  }, [editor]);

  return (
    <div data-cy="note-editor">
      <PlateProvider<MyValue> editor={e}>
        <Toolbar>
          <ToolbarButtons />
        </Toolbar>
        <Plate editableProps={editableProps}>
          <MarkBalloonToolbar />
        </Plate>
      </PlateProvider>
    </div>
  );
};

export default PlateEditor;
