import React from 'react';
import { RenderLeaf } from '@udecode/plate';
import { getPreviewLeafStyles } from './PreviewLeaf.styles';

type PreviewLeafProps = {
  attributes: Record<string, unknown>;
  leaf: unknown;
} & RenderLeaf;

export const PreviewLeaf: React.FC<PreviewLeafProps> = (props) => {
  const { children, attributes, leaf } = props;

  const { root } = getPreviewLeafStyles(leaf as any);

  return (
    <span {...attributes} style={root.css[0] as Record<string, unknown>} className={root.className}>
      {children}
    </span>
  );
};
