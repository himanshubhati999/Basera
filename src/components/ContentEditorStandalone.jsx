// STANDALONE EXAMPLE - Copy this entire file to test the ContentEditor

import React, { useState, useRef } from 'react';
import './ContentEditor.css'; // Make sure this path is correct

/**
 * ContentEditor - A complete React rich-text editor component
 * 
 * Usage:
 * import ContentEditor from './components/ContentEditor';
 * <ContentEditor />
 * 
 * For advanced usage with initial content:
 * <ContentEditor initialContent="<p>Hello World</p>" />
 */

const ContentEditorStandalone = ({ initialContent = '' }) => {
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef(null);

  // Initialize content
  React.useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // Core editing command handler
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Header action handlers
  const toggleEditor = () => setIsEditorVisible(!isEditorVisible);
  
  const handleAddMedia = () => {
    // Example implementation: Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (file.type.startsWith('image/')) {
            executeCommand('insertImage', event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUIBlocks = () => {
    alert('UI Blocks feature - implement custom content blocks here');
  };

  // Toolbar handlers
  const handleParagraphChange = (e) => {
    const value = e.target.value;
    executeCommand('formatBlock', value === 'p' ? '<p>' : `<${value}>`);
  };

  const handleFontChange = (e) => executeCommand('fontName', e.target.value);
  const handleFontSizeChange = (e) => executeCommand('fontSize', e.target.value);
  const handleColorChange = (e) => executeCommand('foreColor', e.target.value);
  const handleBackgroundColorChange = (e) => executeCommand('backColor', e.target.value);

  const insertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url && url !== 'https://') {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url && url !== 'https://') {
      executeCommand('insertImage', url);
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt('Number of rows:', '3') || '0');
    const cols = parseInt(prompt('Number of columns:', '3') || '0');
    if (rows > 0 && cols > 0) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 1em 0;">';
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #cbd5e1;">' + (i === 0 ? `Column ${j+1}` : '&nbsp;') + '</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      executeCommand('insertHTML', tableHTML);
    }
  };

  const toggleSource = () => {
    if (editorRef.current) {
      const isSource = editorRef.current.classList.contains('source-mode');
      if (isSource) {
        editorRef.current.innerHTML = editorRef.current.textContent;
        editorRef.current.classList.remove('source-mode');
        editorRef.current.style.fontFamily = '';
        editorRef.current.style.whiteSpace = '';
        editorRef.current.contentEditable = 'true';
      } else {
        const html = editorRef.current.innerHTML;
        editorRef.current.textContent = html;
        editorRef.current.classList.add('source-mode');
        editorRef.current.style.fontFamily = 'monospace';
        editorRef.current.style.whiteSpace = 'pre-wrap';
      }
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.content-editor-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen?.() || container?.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  };

  // Get current content
  const getContent = () => editorRef.current?.innerHTML || '';
  
  // Clear content
  const clearContent = () => {
    if (editorRef.current && confirm('Clear all content?')) {
      editorRef.current.innerHTML = '';
    }
  };

  return (
    <div className="content-editor-container">
      {/* Dark Header Bar */}
      <div className="content-editor-header">
        <h2 className="content-editor-title">Content</h2>
        <div className="content-editor-actions">
          <button className="header-btn" onClick={toggleEditor}>
            {isEditorVisible ? '👁️ Hide Editor' : '👁️ Show Editor'}
          </button>
          <button className="header-btn" onClick={handleAddMedia}>
            <span className="btn-icon">🖼️</span>
            Add media
          </button>
          <button className="header-btn" onClick={handleUIBlocks}>
            <span className="btn-icon">🧱</span>
            UI Blocks
          </button>
        </div>
      </div>

      {/* Main Editor Body */}
      {isEditorVisible && (
        <div className="content-editor-body">
          {/* WYSIWYG Toolbar */}
          <div className="editor-toolbar">
            <div className="toolbar-row">
              {/* Paragraph/Heading */}
              <select 
                className="toolbar-select" 
                onChange={handleParagraphChange}
                defaultValue="p"
                title="Paragraph style"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
              </select>

              <div className="toolbar-separator"></div>

              {/* Font Family */}
              <select 
                className="toolbar-select toolbar-select-font" 
                onChange={handleFontChange}
                defaultValue="Arial"
                title="Font family"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
              </select>

              {/* Font Size */}
              <select 
                className="toolbar-select toolbar-select-size" 
                onChange={handleFontSizeChange}
                defaultValue="3"
                title="Font size"
              >
                <option value="1">8pt</option>
                <option value="2">10pt</option>
                <option value="3">12pt</option>
                <option value="4">14pt</option>
                <option value="5">18pt</option>
                <option value="6">24pt</option>
                <option value="7">36pt</option>
              </select>

              <div className="toolbar-separator"></div>

              {/* Text Color */}
              <div className="toolbar-color-wrapper">
                <button className="toolbar-btn toolbar-color-btn" title="Text Color">
                  <span className="icon-text-color">A</span>
                  <input 
                    type="color" 
                    className="color-input"
                    onChange={handleColorChange}
                    defaultValue="#000000"
                  />
                </button>
              </div>

              {/* Background Color */}
              <div className="toolbar-color-wrapper">
                <button className="toolbar-btn toolbar-color-btn" title="Background Color">
                  <span className="icon-bg-color">🎨</span>
                  <input 
                    type="color" 
                    className="color-input"
                    onChange={handleBackgroundColorChange}
                    defaultValue="#ffffff"
                  />
                </button>
              </div>

              <div className="toolbar-separator"></div>

              {/* Text Formatting */}
              <button className="toolbar-btn" onClick={() => executeCommand('bold')} title="Bold (Ctrl+B)">
                <strong>B</strong>
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('italic')} title="Italic (Ctrl+I)">
                <em>I</em>
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('underline')} title="Underline (Ctrl+U)">
                <u>U</u>
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('strikeThrough')} title="Strikethrough">
                <s>S</s>
              </button>

              <div className="toolbar-separator"></div>

              {/* Text Alignment */}
              <button className="toolbar-btn" onClick={() => executeCommand('justifyLeft')} title="Align Left">
                ☰
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('justifyCenter')} title="Align Center">
                ☷
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('justifyRight')} title="Align Right">
                ☱
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('justifyFull')} title="Justify">
                ≣
              </button>

              <div className="toolbar-separator"></div>

              {/* Lists */}
              <button className="toolbar-btn" onClick={() => executeCommand('insertOrderedList')} title="Numbered List">
                1. ≡
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('insertUnorderedList')} title="Bulleted List">
                • •
              </button>

              <div className="toolbar-separator"></div>

              {/* Indent */}
              <button className="toolbar-btn" onClick={() => executeCommand('indent')} title="Increase Indent">
                →|
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('outdent')} title="Decrease Indent">
                |←
              </button>

              <div className="toolbar-separator"></div>

              {/* Insert Elements */}
              <button className="toolbar-btn" onClick={insertLink} title="Insert Link">
                🔗
              </button>
              <button className="toolbar-btn" onClick={insertImage} title="Insert Image">
                🖼️
              </button>
              <button className="toolbar-btn" onClick={insertTable} title="Insert Table">
                ⊞
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('insertHTML', '<hr>')} title="Insert Horizontal Line">
                ─
              </button>

              <div className="toolbar-separator"></div>

              {/* Code/Source */}
              <button className="toolbar-btn" onClick={toggleSource} title="View Source Code">
                &lt;/&gt;
              </button>

              <div className="toolbar-separator"></div>

              {/* Undo/Redo */}
              <button className="toolbar-btn" onClick={() => executeCommand('undo')} title="Undo (Ctrl+Z)">
                ↶
              </button>
              <button className="toolbar-btn" onClick={() => executeCommand('redo')} title="Redo (Ctrl+Y)">
                ↷
              </button>

              <div className="toolbar-separator"></div>

              {/* Additional Actions */}
              <button className="toolbar-btn" onClick={() => executeCommand('removeFormat')} title="Clear Formatting">
                ✗
              </button>
              <button className="toolbar-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                ⛶
              </button>
            </div>
          </div>

          {/* Editable Content Area */}
          <div 
            ref={editorRef}
            className="editor-content"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            spellCheck="true"
          >
            {/* Content will be rendered here */}
          </div>
        </div>
      )}

      {/* Images Section Footer */}
      {isEditorVisible && (
        <div className="content-editor-footer">
          <div className="images-section">
            <h3 className="images-title">Images</h3>
            <div className="images-placeholder">
              Drop images here or click "Add media" to upload
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditorStandalone;

// Example usage in your App.jsx:
/*
import ContentEditorStandalone from './components/ContentEditorStandalone';

function App() {
  return (
    <div className="App">
      <ContentEditorStandalone />
    </div>
  );
}
*/
