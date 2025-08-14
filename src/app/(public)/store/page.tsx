import PublicStore from '@/components/store/PublicStore'

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PublicStore />
      </div>
    </div>
  )
}