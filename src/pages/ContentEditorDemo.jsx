import React from 'react';
import ContentEditor from '../components/ContentEditor';
import './ContentEditorDemo.css';

const ContentEditorDemo = () => {
  return (
    <div className="content-editor-demo-page">
      <div className="demo-header">
        <h1>Rich Text Content Editor</h1>
        <p>A modern CMS-style editor built with React</p>
      </div>
      
      <div className="demo-container">
        <ContentEditor />
      </div>

      <div className="demo-instructions">
        <h2>Features</h2>
        <ul>
          <li>✅ Full WYSIWYG editing with contentEditable</li>
          <li>✅ Text formatting (Bold, Italic, Underline, Strikethrough)</li>
          <li>✅ Paragraph and heading styles</li>
          <li>✅ Font family and size selection</li>
          <li>✅ Text and background colors</li>
          <li>✅ Text alignment options</li>
          <li>✅ Ordered and unordered lists</li>
          <li>✅ Indent/outdent controls</li>
          <li>✅ Insert links, images, tables, and media</li>
          <li>✅ Source code view toggle</li>
          <li>✅ Undo/redo functionality</li>
          <li>✅ Fullscreen mode</li>
          <li>✅ Show/hide editor toggle</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentEditorDemo;
