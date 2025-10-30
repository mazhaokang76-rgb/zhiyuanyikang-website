import React, { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  folder?: string
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  folder = 'uploads',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择有效的图片文件')
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB')
      return
    }

    setError('')
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    if (!user) {
      setError('需要登录才能上传图片')
      return
    }

    setUploading(true)

    try {
      // 转换为base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string

          // 使用Edge Function上传图片
          const { data, error } = await supabase.functions.invoke('admin-image-upload', {
            body: {
              imageData: base64Data,
              fileName: file.name,
              folder: folder
            }
          })

          if (error) throw error

          const imageUrl = data.data.publicUrl
          setPreview(imageUrl)
          onImageUploaded(imageUrl)
          
        } catch (err: any) {
          console.error('图片上传失败:', err)
          setError(err.message || '图片上传失败')
        } finally {
          setUploading(false)
        }
      }
      reader.onerror = () => {
        setError('文件读取失败')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('图片上传错误:', err)
      setError(err.message || '图片上传失败')
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview('')
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview ? (
        <Card className="relative">
          <div className="relative group">
            <img
              src={preview}
              alt="预览"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openFileDialog}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  更换
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removeImage}
                  disabled={uploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={openFileDialog}
        >
          <div className="p-8 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">正在上传图片...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">点击上传图片</p>
                <p className="text-sm text-gray-500">支持 JPG、PNG 格式，最大 5MB</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default ImageUpload
