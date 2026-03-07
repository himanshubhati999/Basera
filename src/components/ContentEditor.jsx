import React, { useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './ContentEditor.css';

const ContentEditor = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Toolbar command handlers
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  const handleAddMedia = () => {
    fileInputRef.current?.click();
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

  // Image upload functions
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    // Add all files to FormData
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.UPLOAD_MULTIPLE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.images) {
        setUploadedImages(prev => [...prev, ...data.images]);
        alert(`${data.images.length} image(s) uploaded successfully!`);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const insertImageIntoEditor = (imageUrl) => {
    const imgHtml = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 1em 0;" />`;
    executeCommand('insertHTML', imgHtml);
  };

  const deleteUploadedImage = async (image, index) => {
    if (!confirm('Delete this image?')) return;

    try {
      // Only call delete API if image has filename (was uploaded to server)
      if (image.filename) {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.DELETE_IMAGE, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ filename: image.filename })
        });

        if (!response.ok) {
          throw new Error('Failed to delete image from server');
        }
      }
      
      // Remove from state (works for both uploaded and URL images)
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      alert('Image removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  const handleAddImageFromUrl = () => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // Add image from URL (without filename, so it won't be deleted from server)
    setUploadedImages(prev => [...prev, { url: imageUrl, filename: null }]);
    setImageUrl('');
    alert('Image added from URL!');
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
          >
            {/* Placeholder content */}
          </div>
        </div>
      )}

      {/* Images Section */}
      {isEditorVisible && (
        <div className="content-editor-footer">
          <div className="images-section">
            <h3 className="images-title">Images</h3>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {/* Drag and Drop Zone */}
            <div 
              className={`images-drop-zone ${dragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="upload-loading">
                  <div className="spinner"></div>
                  <p>Uploading images...</p>
                </div>
              ) : (
                <>
                  <span className="upload-icon">📁</span>
                  <p className="upload-text">Click here or drag & drop images to upload</p>
                  <p className="upload-hint">Supports: JPG, PNG, GIF (Max 5MB per image)</p>
                </>
              )}
            </div>

            {/* OR divider */}
            <div className="url-divider">
              <span>OR</span>
            </div>

            {/* URL Input */}
            <div className="url-input-wrapper">
              <input
                type="text"
                className="url-input"
                placeholder="Paste image URL here (e.g., https://example.com/image.jpg)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddImageFromUrl();
                  }
                }}
              />
              <button 
                className="url-add-btn"
                onClick={handleAddImageFromUrl}
              >
                Add from URL
              </button>
            </div>

            {/* Uploaded Images Gallery */}
            {uploadedImages.length > 0 && (
              <div className="images-gallery">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.url} alt={`Uploaded ${index + 1}`} />
                    <div className="image-actions">
                      <button 
                        className="image-action-btn insert-btn"
                        onClick={() => insertImageIntoEditor(image.url)}
                        title="Insert into editor"
                      >
                        ➕ Insert
                      </button>
                      <button 
                        className="image-action-btn copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(image.url);
                          alert('Image URL copied!');
                        }}
                        title="Copy URL"
                      >
                        📋 Copy
                      </button>
                      <button 
                        className="image-action-btn delete-btn"
                        onClick={() => deleteUploadedImage(image, index)}
                        title="Delete image"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
