import PublicNavigation from '@/components/PublicNavigation'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}