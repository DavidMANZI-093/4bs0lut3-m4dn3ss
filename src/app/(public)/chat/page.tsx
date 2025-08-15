import PublicChat from '@/components/chat/PublicChat'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4">
        <PublicChat />
      </div>
    </div>
  )
}