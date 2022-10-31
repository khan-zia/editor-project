import React, { useMemo, useRef } from 'react';
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
  createNormalizeTypesPlugin,
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
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  Plate,
  PlateProvider,
} from '@udecode/plate';

import { createJuicePlugin } from '@udecode/plate-juice';
import { createBlockSelectionPlugin } from '@udecode/plate-selection';
import { alignPlugin } from '../plate/align/alignPlugin';
import { autoformatPlugin } from '../plate/autoformat/autoformatPlugin';
import { MarkBalloonToolbar } from '../plate/balloon-toolbar/MarkBalloonToolbar';
import { editableProps } from '../plate/common/editableProps';
import { CursorOverlayContainer } from '../plate/cursor-overlay/CursorOverlayContainer';
import { dragOverCursorPlugin } from '../plate/cursor-overlay/dragOverCursorPlugin';
import { exitBreakPlugin } from '../plate/exit-break/exitBreakPlugin';
import { forcedLayoutPlugin } from '../plate/forced-layout/forcedLayoutPlugin';
import { indentPlugin } from '../plate/indent/indentPlugin';
import { linkPlugin } from '../plate/link/linkPlugin';
import { resetBlockTypePlugin } from '../plate/reset-node/resetBlockTypePlugin';
import { selectOnBackspacePlugin } from '../plate/select-on-backspace/selectOnBackspacePlugin';
import { softBreakPlugin } from '../plate/soft-break/softBreakPlugin';
import { Toolbar } from '../plate/toolbar/Toolbar';
import { trailingBlockPlugin } from '../plate/trailing-block/trailingBlockPlugin';
import { createMyPlugins, MyEditor, MyPlatePlugin, MyValue } from '../plate/typescript/plateTypes';
import { ToolbarButtons } from '../plate/toolbar/ToolbarButtons';
import { withStyledPlaceHolders } from '../plate/placeholder/withStyledPlaceHolders';

let components = createPlateUI({});
components = withStyledPlaceHolders(components);

type PlateEditorProps = {
  initialValue: MyValue | undefined;
  onChange: (value: MyValue) => void;
};

const PlateEditor: React.FC<PlateEditorProps> = ({ initialValue, onChange }) => {
  const containerRef = useRef(null);

  const plugins = useMemo(
    () =>
      createMyPlugins(
        [
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
          // createBlockSelectionPlugin(),
          dragOverCursorPlugin,
          createIndentPlugin(indentPlugin),
          createAutoformatPlugin<AutoformatPlugin<MyValue, MyEditor>, MyValue, MyEditor>(autoformatPlugin),
          createResetNodePlugin(resetBlockTypePlugin),
          createSoftBreakPlugin(softBreakPlugin),
          createExitBreakPlugin(exitBreakPlugin),
          createNormalizeTypesPlugin(forcedLayoutPlugin),
          createTrailingBlockPlugin(trailingBlockPlugin),
          createSelectOnBackspacePlugin(selectOnBackspacePlugin),
          createComboboxPlugin(),
          createMentionPlugin(),
          createDeserializeMdPlugin(),
          createDeserializeCsvPlugin(),
          createDeserializeDocxPlugin(),
          createJuicePlugin() as MyPlatePlugin,
        ],
        {
          components,
        },
      ),
    [],
  );

  return (
    <PlateProvider plugins={plugins} initialValue={initialValue} onChange={onChange}>
      <Toolbar>
        <ToolbarButtons />
      </Toolbar>
      <Plate editableProps={editableProps}>
        <MarkBalloonToolbar />
        <CursorOverlayContainer containerRef={containerRef} />
      </Plate>
    </PlateProvider>
  );
};

export default PlateEditor;
