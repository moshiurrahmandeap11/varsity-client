import { useEffect, useRef, useState } from "react";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
}) => {
  const editorRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleBold = () => {
    editorRef.current.focus();
    document.execCommand("bold", false, null);
    updateContent();
  };

  const handleItalic = () => {
    editorRef.current.focus();
    document.execCommand("italic", false, null);
    updateContent();
  };

  const handleUnderline = () => {
    editorRef.current.focus();
    document.execCommand("underline", false, null);
    updateContent();
  };

  const handleOrderedList = () => {
    editorRef.current.focus();
    document.execCommand("insertOrderedList", false, null);
    updateContent();
  };

  const handleUnorderedList = () => {
    editorRef.current.focus();
    document.execCommand("insertUnorderedList", false, null);
    updateContent();
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) {
      alert("Please enter a URL");
      return;
    }

    try {
      new URL(linkUrl);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    editorRef.current.focus();

    const selection = window.getSelection();
    const selectedText = selection.toString();
    const displayText = selectedText || linkText || linkUrl;

    const link = document.createElement("a");
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = displayText;
    link.style.cssText =
      "color: #3b82f6; text-decoration: underline; cursor: pointer;";

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(link);
      range.setStartAfter(link);
      range.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(range);

      const space = document.createTextNode(" ");
      range.insertNode(space);
    } else {
      editorRef.current.appendChild(link);
      editorRef.current.appendChild(document.createTextNode(" "));
    }

    updateContent();
    setShowLinkInput(false);
    setLinkUrl("");
    setLinkText("");
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    updateContent();
  };

  const handleClearFormatting = () => {
    editorRef.current.focus();
    document.execCommand("removeFormat", false, null);
    document.execCommand("unlink", false, null);
    updateContent();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const listItem = range.startContainer.parentElement?.closest("li");
        if (listItem && listItem.textContent.trim() === "") {
          e.preventDefault();
          document.execCommand("insertParagraph", false, null);
        }
      }
    }
  };

  return (
    <div className="rich-text-editor w-full">
      {/* Toolbar */}
      <div className="toolbar flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-3 bg-white/5 border border-white/10 rounded-t-xl">
        <button
          type="button"
          onClick={handleBold}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-semibold text-sm sm:text-base text-white/80"
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={handleItalic}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base text-white/80"
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={handleUnderline}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base text-white/80"
          title="Underline"
        >
          <u>U</u>
        </button>

        <div className="w-px h-6 sm:h-8 bg-white/10"></div>

        <button
          type="button"
          onClick={handleUnorderedList}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs sm:text-sm text-white/80"
          title="Bullet List"
        >
          <span className="flex items-center gap-1">
            <span>•</span>
            <span className="hidden sm:inline">List</span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleOrderedList}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs sm:text-sm text-white/80"
          title="Numbered List"
        >
          <span className="flex items-center gap-1">
            <span>1.</span>
            <span className="hidden sm:inline">List</span>
          </span>
        </button>

        <div className="w-px h-6 sm:h-8 bg-white/10"></div>

        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs sm:text-sm text-white/80"
          title="Add Link"
        >
          <span className="flex items-center gap-1">
            <span>🔗</span>
            <span className="hidden sm:inline">Link</span>
          </span>
        </button>

        <div className="w-px h-6 sm:h-8 bg-white/10"></div>

        <button
          type="button"
          onClick={handleClearFormatting}
          className="px-2 sm:px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs sm:text-sm text-white/80"
          title="Clear Formatting"
        >
          <span className="flex items-center gap-1">
            <span>🧹</span>
            <span className="hidden sm:inline">Clear</span>
          </span>
        </button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="link-input p-3 sm:p-4 bg-white/5 border border-white/10 border-t-0">
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                URL *
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Display Text (Optional)
              </label>
              <input
                type="text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
              <p className="text-xs text-white/40 mt-1">
                Leave empty to use selected text or URL
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddLink}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Insert Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="editor p-3 sm:p-4 border border-white/10 border-t-0 rounded-b-xl focus:outline-none bg-white/5 text-white/90"
        style={{
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto", // ✅ Vertical scroll bar
          overflowX: "hidden", // ✅ Hide horizontal scroll
          wordWrap: "break-word", // ✅ Break long words
          wordBreak: "break-word", // ✅ Break words properly
          whiteSpace: "pre-wrap", // ✅ Preserve whitespace but wrap
          direction: "ltr",
          textAlign: "left",
        }}
        dir="ltr"
        data-placeholder={placeholder}
      />

      <style>{`
                .rich-text-editor {
                    width: 100%;
                }
                
                .editor:empty:before {
                    content: attr(data-placeholder);
                    color: rgba(255, 255, 255, 0.3);
                    pointer-events: none;
                    font-style: italic;
                }
                
                .editor {
                    direction: ltr !important;
                    text-align: left !important;
                    line-height: 1.6;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                
                .editor * {
                    direction: ltr !important;
                    color: rgba(255, 255, 255, 0.9) !important;
                    max-width: 100%;              /* ✅ Prevent overflow */
                }
                
                .editor p {
                    margin: 0 0 8px 0;
                    word-wrap: break-word;        /* ✅ Word wrap */
                }
                
                .editor ul,
                .editor ol {
                    margin: 8px 0;
                    padding-left: 24px;
                }
                
                .editor li {
                    margin: 4px 0;
                    padding-left: 4px;
                }
                
                .editor ul {
                    list-style-type: disc;
                }
                
                .editor ol {
                    list-style-type: decimal;
                }
                
                .editor a {
                    color: #3b82f6 !important;
                    text-decoration: underline;
                    cursor: pointer;
                    word-break: break-all;        /* ✅ Break long URLs */
                }
                
                .editor a:hover {
                    color: #60a5fa !important;
                }
                
                .editor strong {
                    font-weight: 700;
                }
                
                .editor em {
                    font-style: italic;
                }
                
                .editor u {
                    text-decoration: underline;
                }
                
                /* ✅ Scrollbar Styling */
                .editor::-webkit-scrollbar {
                    width: 6px;
                }
                
                .editor::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                
                .editor::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    transition: background 0.2s;
                }
                
                .editor::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                /* Firefox Scrollbar */
                .editor {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
                }
                
                .editor img {
                    max-width: 100%;             
                    height: auto;
                    border-radius: 8px;
                }
                
                .editor table {
                    max-width: 100%;             
                    border-collapse: collapse;
                }
                
                .editor pre {
                    white-space: pre-wrap;        
                    word-wrap: break-word;
                    overflow-x: auto;
                }
                
                @media (max-width: 640px) {
                    .toolbar {
                        gap: 0.25rem;
                    }
                    
                    .toolbar button {
                        padding: 0.5rem 0.75rem;
                    }
                    
                    .editor {
                        padding: 1rem;
                        min-height: 150px;
                        max-height: 300px;        
                    }
                }
            `}</style>
    </div>
  );
};

export default RichTextEditor;
