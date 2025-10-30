import React, { useState, useEffect, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容...',
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'blockquote'],
      ['clean']
    ]
  }), [])

  const formats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link',
    'color', 'background',
    'align'
  ], [])

  const handleChange = (content: string) => {
    onChange(content)
  }

  // 在服务器端渲染时显示加载占位符
  if (!isMounted) {
    return (
      <div className={`border border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <div className="text-gray-500">正在加载编辑器...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <style>
        {`
          .ql-editor {
            min-height: 200px !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            font-family: inherit !important;
            padding: 12px 15px !important;
            background: white !important;
          }
          .ql-editor.ql-blank::before {
            color: #9ca3af !important;
            font-style: normal !important;
            font-size: 14px !important;
            left: 15px !important;
            content: attr(data-placeholder) !important;
          }
          .ql-toolbar {
            border: 1px solid #d1d5db !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
            background: #f9fafb !important;
          }
          .ql-container {
            border: 1px solid #d1d5db !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            font-family: inherit !important;
          }
          .ql-tooltip {
            z-index: 1000 !important;
          }
          .ql-snow .ql-tooltip[data-mode="link"]::before {
            content: "请输入链接地址:" !important;
          }
          .ql-snow .ql-editor {
            color: #374151 !important;
          }
          .ql-snow .ql-editor strong {
            font-weight: 600 !important;
          }
        `}
      </style>
      {/* @ts-ignore */}
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor
