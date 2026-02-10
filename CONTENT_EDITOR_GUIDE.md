# Content Editor Component

A modern, fully-featured React rich-text editor UI that visually matches popular CMS content editors like WordPress and CKEditor.

## 📁 Files Created

- `src/components/ContentEditor.jsx` - Main editor component
- `src/components/ContentEditor.css` - Component styles
- `src/pages/ContentEditorDemo.jsx` - Demo page (optional)
- `src/pages/ContentEditorDemo.css` - Demo page styles (optional)

## 🚀 Quick Start

### Basic Usage

```jsx
import ContentEditor from './components/ContentEditor';

function App() {
  return (
    <div>
      <ContentEditor />
    </div>
  );
}
```

### With Custom Routing (React Router)

```jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContentEditorDemo from './pages/ContentEditorDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<ContentEditorDemo />} />
      </Routes>
    </Router>
  );
}
```

## ✨ Features

### Header Actions
- **Show/Hide Editor** - Toggle editor visibility
- **Add Media** - Media upload placeholder (ready for implementation)
- **UI Blocks** - UI blocks placeholder (ready for implementation)

### Text Formatting
- Bold, Italic, Underline, Strikethrough
- Paragraph and heading styles (H1-H6)
- Font family selection
- Font size control
- Text color picker
- Background color picker

### Layout & Alignment
- Left, center, right, justify alignment
- Ordered and unordered lists
- Indent and outdent

### Content Insertion
- Links (with URL prompt)
- Images (with URL prompt)
- Tables (dynamic row/column creation)
- Media embeds

### Editor Controls
- Undo and redo
- Source code toggle
- Fullscreen mode
- Responsive design

## 🎨 Customization

### Styling

The component uses CSS modules with custom properties. You can customize the appearance by modifying `ContentEditor.css`:

```css
/* Change header background */
.content-editor-header {
  background: #your-color;
}

/* Change toolbar style */
.editor-toolbar {
  background: #your-color;
}

/* Adjust editor height */
.editor-content {
  min-height: 600px; /* Change as needed */
}
```

### Extending Functionality

#### Add Custom Toolbar Buttons

```jsx
// In ContentEditor.jsx, add to toolbar-row:
<button 
  className="toolbar-btn" 
  onClick={() => executeCommand('yourCommand')}
  title="Your Feature"
>
  Icon
</button>
```

#### Implement Media Upload

```jsx
const handleAddMedia = async () => {
  // Open file picker
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    // Upload logic here
    const url = await uploadFile(file);
    executeCommand('insertImage', url);
  };
  input.click();
};
```

#### Save Content

```jsx
const [content, setContent] = useState('');

const handleSave = async () => {
  const editorContent = editorRef.current.innerHTML;
  // Send to API
  await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: editorContent })
  });
};

// Add save button in header
<button className="header-btn" onClick={handleSave}>
  Save Content
</button>
```

## 🔧 Advanced Usage

### Load Existing Content

```jsx
import { useEffect } from 'react';

const ContentEditor = ({ initialContent }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // ... rest of component
};
```

### Get Content Programmatically

```jsx
const getEditorContent = () => {
  return editorRef.current?.innerHTML || '';
};

const getPlainText = () => {
  return editorRef.current?.textContent || '';
};
```

### Custom Commands

```jsx
// Add custom formatting
const highlightText = () => {
  executeCommand('backColor', '#ffff00');
  executeCommand('foreColor', '#000000');
};

// Clear formatting
const clearFormat = () => {
  executeCommand('removeFormat');
};
```

## 📱 Responsive Behavior

The editor automatically adapts to different screen sizes:
- **Desktop**: Full toolbar with all options
- **Tablet**: Optimized button spacing
- **Mobile**: Compact toolbar, stacked header actions

## 🎯 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🐛 Known Limitations

1. **contentEditable quirks**: Different browsers may handle certain operations differently
2. **Copy/paste**: Formatted content from external sources may include unwanted styles
3. **Mobile keyboards**: Some mobile keyboards may interfere with toolbar visibility

## 💡 Tips

1. **Better Tables**: Consider integrating a table plugin for advanced table editing
2. **Image Upload**: Implement proper file upload to cloud storage (AWS S3, Cloudinary, etc.)
3. **Auto-save**: Add auto-save functionality with debouncing
4. **Collaboration**: Consider integrating real-time collaboration (WebSockets, Firebase)
5. **Validation**: Add content validation before saving

## 🔌 Integration with Backend

### Example with Express.js

```javascript
// Backend API
app.post('/api/content', async (req, res) => {
  const { content } = req.body;
  // Sanitize HTML to prevent XSS
  const clean = sanitizeHtml(content);
  // Save to database
  await Content.create({ html: clean });
  res.json({ success: true });
});
```

### Security Considerations

Always sanitize HTML content on the server side:

```bash
npm install sanitize-html
```

```javascript
import sanitizeHtml from 'sanitize-html';

const cleanContent = sanitizeHtml(dirtyContent, {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'],
  allowedAttributes: {
    'a': ['href', 'title'],
    'img': ['src', 'alt', 'title'],
    'table': ['border', 'style'],
    'td': ['style'],
    'th': ['style']
  }
});
```

## 📄 License

Free to use in your projects.

## 🤝 Contributing

Feel free to extend and customize this component for your specific needs!

## 📞 Support

For issues or questions, refer to the implementation code and comments.
