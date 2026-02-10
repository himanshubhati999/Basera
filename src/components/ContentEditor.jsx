import React, { useState, useRef } from 'react';
import './ContentEditor.css';

const ContentEditor = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  // Toolbar command handlers
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  const handleAddMedia = () => {
    console.log('Add media clicked');
    // Placeholder for media upload functionality
  };

  const handleUIBlocks = () => {
    console.log('UI Blocks clicked');
    // Placeholder for UI blocks functionality
  };

  const handleParagraphChange = (e) => {
    const value = e.target.value;
    if (value === 'p') {
      executeCommand('formatBlock', '<p>');
    } else {
      executeCommand('formatBlock', `<${value}>`);
    }
  };

  const handleFontChange = (e) => {
    executeCommand('fontName', e.target.value);
  };

  const handleFontSizeChange = (e) => {
    executeCommand('fontSize', e.target.value);
  };

  const handleColorChange = (e) => {
    executeCommand('foreColor', e.target.value);
  };

  const handleBackgroundColorChange = (e) => {
    executeCommand('backColor', e.target.value);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      executeCommand('insertHTML', tableHTML);
    }
  };

  const toggleSource = () => {
    if (editorRef.current) {
      const isSource = editorRef.current.contentEditable === 'false';
      if (isSource) {
        editorRef.current.innerHTML = editorRef.current.textContent;
        editorRef.current.contentEditable = 'true';
      } else {
        const html = editorRef.current.innerHTML;
        editorRef.current.textContent = html;
        editorRef.current.contentEditable = 'false';
      }
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.content-editor-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="content-editor-container">
      {/* Header */}
      <div className="content-editor-header">
        <h2 className="content-editor-title">Content</h2>
        <div className="content-editor-actions">
          <button className="header-btn" onClick={toggleEditor}>
            Show/Hide Editor
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

      {/* Editor Area */}
      {isEditorVisible && (
        <div className="content-editor-body">
          {/* Toolbar */}
          <div className="editor-toolbar">
            {/* Row 1 */}
            <div className="toolbar-row">
              {/* Paragraph/Heading dropdown */}
              <select 
                className="toolbar-select" 
                onChange={handleParagraphChange}
                defaultValue="p"
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

              {/* Font family */}
              <select 
                className="toolbar-select toolbar-select-font" 
                onChange={handleFontChange}
                defaultValue="Arial"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
              </select>

              {/* Font size */}
              <select 
                className="toolbar-select toolbar-select-size" 
                onChange={handleFontSizeChange}
                defaultValue="3"
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

              {/* Text color */}
              <div className="toolbar-color-wrapper">
                <button 
                  className="toolbar-btn toolbar-color-btn"
                  title="Text Color"
                >
                  <span className="icon-text-color">A</span>
                  <input 
                    type="color" 
                    className="color-input"
                    onChange={handleColorChange}
                    defaultValue="#000000"
                  />
                </button>
              </div>

              {/* Background color */}
              <div className="toolbar-color-wrapper">
                <button 
                  className="toolbar-btn toolbar-color-btn"
                  title="Background Color"
                >
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

              {/* Bold, Italic, Underline */}
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('bold')}
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('italic')}
                title="Italic"
              >
                <em>I</em>
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('underline')}
                title="Underline"
              >
                <u>U</u>
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('strikeThrough')}
                title="Strikethrough"
              >
                <s>S</s>
              </button>

              <div className="toolbar-separator"></div>

              {/* Alignment */}
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('justifyLeft')}
                title="Align Left"
              >
                ☰
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('justifyCenter')}
                title="Align Center"
              >
                ☷
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('justifyRight')}
                title="Align Right"
              >
                ☱
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('justifyFull')}
                title="Justify"
              >
                ≣
              </button>

              <div className="toolbar-separator"></div>

              {/* Lists */}
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('insertOrderedList')}
                title="Numbered List"
              >
                ≡
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('insertUnorderedList')}
                title="Bulleted List"
              >
                •
              </button>

              <div className="toolbar-separator"></div>

              {/* Indent */}
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('indent')}
                title="Increase Indent"
              >
                →
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('outdent')}
                title="Decrease Indent"
              >
                ←
              </button>

              <div className="toolbar-separator"></div>

              {/* Insert elements */}
              <button 
                className="toolbar-btn" 
                onClick={insertLink}
                title="Insert Link"
              >
                🔗
              </button>
              <button 
                className="toolbar-btn" 
                onClick={insertImage}
                title="Insert Image"
              >
                🖼️
              </button>
              <button 
                className="toolbar-btn" 
                onClick={insertTable}
                title="Insert Table"
              >
                ⊞
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('insertHTML', '<video controls></video>')}
                title="Insert Media"
              >
                ▶️
              </button>

              <div className="toolbar-separator"></div>

              {/* Code/Source */}
              <button 
                className="toolbar-btn" 
                onClick={toggleSource}
                title="Source Code"
              >
                &lt;/&gt;
              </button>

              <div className="toolbar-separator"></div>

              {/* Undo/Redo */}
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('undo')}
                title="Undo"
              >
                ↶
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => executeCommand('redo')}
                title="Redo"
              >
                ↷
              </button>

              <div className="toolbar-separator"></div>

              {/* Fullscreen */}
              <button 
                className="toolbar-btn" 
                onClick={toggleFullscreen}
                title="Fullscreen"
              >
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
          >
            {/* Placeholder content */}
          </div>
        </div>
      )}

      {/* Images Section (placeholder) */}
      {isEditorVisible && (
        <div className="content-editor-footer">
          <div className="images-section">
            <h3 className="images-title">Images</h3>
            <div className="images-placeholder">
              {/* Placeholder for image gallery */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
