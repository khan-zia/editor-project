import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export const IFrame = ({ children, ...props }: any) => {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode = contentRef && contentRef.contentWindow && contentRef.contentWindow.document.body;

  return (
    <iframe {...props} ref={setContentRef}>
      {mountNode && createPortal(React.Children.only(children), mountNode)}
    </iframe>
  );
};
