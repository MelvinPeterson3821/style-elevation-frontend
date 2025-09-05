import Quill from 'quill'

export class RichTextEditor {
  constructor() {
    this.editors = new Map()
    this.init()
  }

  init() {
    this.waitForQuill()
  }

  waitForQuill() {
    if (typeof Quill !== 'undefined') {
      this.initializeEditors()
    } else {
      setTimeout(() => this.waitForQuill(), 100)
    }
  }

  initializeEditors() {
    // Initialize all rich text editors on the page
    const containers = document.querySelectorAll('[data-rich-text-editor]')
    
    containers.forEach(container => {
      const editorId = container.dataset.richTextEditor
      this.createEditor(container, editorId)
    })
  }

  createEditor(container, editorId) {
    const quill = new Quill(container, {
      theme: 'snow',
      placeholder: container.dataset.placeholder || 'Enter content here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    })

    // Apply custom styling
    this.applyCustomStyling()

    // Add custom format handler for bold text
    quill.on('selection-change', (range, oldRange, source) => {
      if (range && source === 'user') {
        const format = quill.getFormat(range)
        if (format.bold) {
          quill.formatText(range.index, range.length, 'color', 'var(--blue)')
        }
      }
    })

    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        const selection = quill.getSelection()
        if (selection) {
          const format = quill.getFormat(selection)
          if (format.bold && !format.color) {
            quill.formatText(selection.index, selection.length, 'color', 'var(--blue)')
          }
        }
      }
    })

    this.editors.set(editorId, quill)
    return quill
  }

  applyCustomStyling() {
    if (document.getElementById('rich-text-editor-styles')) return

    const style = document.createElement('style')
    style.id = 'rich-text-editor-styles'
    style.textContent = `
      .ql-editor {
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif !important;
        font-size: 28px !important;
        line-height: 1.3em !important;
        font-weight: 400 !important;
        color: var(--memberstack-library--ms-main-text-color) !important;
        min-height: 100px !important;
      }
      
      .ql-editor.ql-blank::before {
        color: var(--memberstack-library--ms-input-placeholder) !important;
        font-style: normal !important;
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif !important;
        font-size: 28px !important;
      }
      
      .ql-editor strong[style*="color: var(--blue)"],
      .ql-editor b[style*="color: var(--blue)"],
      .ql-editor span[style*="color: var(--blue)"] {
        color: var(--blue) !important;
      }
    `
    document.head.appendChild(style)
  }

  getEditor(editorId) {
    return this.editors.get(editorId)
  }

  getContent(editorId) {
    const editor = this.editors.get(editorId)
    return editor ? editor.root.innerHTML : ''
  }
}
