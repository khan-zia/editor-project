import { AutoformatPlugin, AutoformatRule } from '@udecode/plate';
import { MyEditor, MyPlatePlugin, MyValue } from '../typescript/plateTypes';
import { autoformatRules } from './autoformatRules';

export const autoformatPlugin: Partial<MyPlatePlugin<AutoformatPlugin<MyValue, MyEditor>>> = {
  options: {
    rules: autoformatRules as AutoformatRule<MyValue, MyEditor>[],
    enableUndoOnDelete: true,
  },
};
