'use client'

import { useState, useEffect } from 'react'
import { Play, Square, Settings, ExternalLink } from 'lucide-react'
import YouTubePlayer from './YouTubePlayer'
import { extractYouTubeId } from '@/app/api/livestream/route'

interface LiveStream {
  id: string
  youtubeUrl: string | null
  isActive: boolean
  title: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminLiveStream() {
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    title: '',
    description: '',
    isActive: true
  })

  useEffect(() => {
    fetchCurrentStream()
  }, [])

  const fetchCurrentStream = async () => {
    try {
      const response = await fetch('/api/livestream')
      const data = await response.json()
      if (data.success) {
        setStream(data.stream)
        if (data.stream) {
          setFormData({
            youtubeUrl: data.stream.youtubeUrl || '',
            title: data.stream.title || '',
            description: data.stream.description || '',
            isActive: data.stream.isActive
          })
        }
      }
    } catch (error) {
      console.error('Error fetching stream:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/livestream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setStream(data.stream)
        setShowForm(false)
        alert('Live stream updated successfully!')
      } else {
        alert(data.error || 'Failed to update stream')
      }
    } catch (error) {
      console.error('Error updating stream:', error)
      alert('Failed to update stream')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStream = async () => {
    if (!stream) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/livestream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isActive: !stream.isActive
        })
      })

      const data = await response.json()
      if (data.success) {
        setStream(data.stream)
        setFormData(prev => ({ ...prev, isActive: data.stream.isActive }))
      }
    } catch (error) {
      console.error('Error toggling stream:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const videoId = stream?.youtubeUrl ? extractYouTubeId(stream.youtubeUrl) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Play className="w-6 h-6" />
          Live Stream Management
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure Stream
          </button>
          {stream && (
            <button
              onClick={toggleStream}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                stream.isActive
                  ? 'bg-[var(--error)] text-white hover:bg-red-700'
                  : 'bg-[var(--success)] text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {stream.isActive ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Stream
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Stream
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stream Status */}
      <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Current Stream Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            stream?.isActive 
              ? 'bg-[var(--success)] text-white' 
              : 'bg-[var(--pale-dogwood-300)] text-[var(--text-secondary)]'
          }`}>
            {stream?.isActive ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>

        {stream ? (
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Title:</span>
              <p className="text-[var(--text-primary)]">{stream.title || 'No title set'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">YouTube URL:</span>
              <div className="flex items-center gap-2">
                <p className="text-[var(--text-primary)] truncate">{stream.youtubeUrl || 'No URL set'}</p>
                {stream.youtubeUrl && (
                  <a
                    href={stream.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Description:</span>
              <p className="text-[var(--text-primary)]">{stream.description || 'No description set'}</p>
            </div>
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">No stream configured yet.</p>
        )}
      </div>

      {/* Configuration Form */}
      {showForm && (
        <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Configure Live Stream</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="https://youtu.be/LPDnemFoqVk or https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Enter a YouTube video URL. The video ID will be extracted automatically.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Stream Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Live Game Stream"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                rows={3}
                placeholder="Description of the live stream..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">
                Activate stream immediately
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Stream'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-[var(--pale-dogwood-300)] text-[var(--text-secondary)] px-6 py-2 rounded-lg hover:bg-[var(--pale-dogwood-400)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview */}
      {videoId && stream?.isActive && (
        <div className="bg-[var(--surface)] rounded-lg card-shadow border border-[var(--border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Stream Preview</h3>
          <YouTubePlayer videoId={videoId} autoplay={false} muted={true} />
        </div>
      )}
    </div>
  )
}