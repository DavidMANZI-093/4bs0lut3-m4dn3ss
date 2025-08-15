import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/livestream - Get current live stream
export async function GET() {
  try {
    // First try to get active stream
    let stream = await prisma.liveStream.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    // If no active stream, get the most recent stream for testing purposes
    if (!stream) {
      stream = await prisma.liveStream.findFirst({
        orderBy: { updatedAt: 'desc' }
      })
    }

    return NextResponse.json({ 
      success: true, 
      stream: stream || null 
    })
  } catch (error) {
    console.error('Error fetching live stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live stream' },
      { status: 500 }
    )
  }
}

// POST /api/livestream - Create or update live stream (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { youtubeUrl, title, description, isActive } = body

    // Validate YouTube URL
    if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // If deactivating, just update all existing streams to inactive
    if (isActive === false) {
      await prisma.liveStream.updateMany({
        data: { isActive: false }
      })
      
      return NextResponse.json({ 
        success: true,
        message: 'All live streams deactivated'
      })
    }

    // Otherwise, deactivate all existing streams first
    await prisma.liveStream.updateMany({
      data: { isActive: false }
    })

    // Create new stream
    const stream = await prisma.liveStream.create({
      data: {
        youtubeUrl: youtubeUrl || null,
        title: title || null,
        description: description || null,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({ 
      success: true, 
      stream 
    })
  } catch (error) {
    console.error('Error creating live stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create live stream' },
      { status: 500 }
    )
  }
}

// Helper function to validate YouTube URLs
function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
  return youtubeRegex.test(url)
}

// Helper function to extract YouTube video ID
export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : null
}