'use client'

import { useEffect, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string
  className?: string
  autoplay?: boolean
  muted?: boolean
}

export default function YouTubePlayer({ 
  videoId, 
  className = '', 
  autoplay = true, 
  muted = true 
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: '1',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    fs: '1',
    playsinline: '1'
  }).toString()}`

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Live Stream"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}