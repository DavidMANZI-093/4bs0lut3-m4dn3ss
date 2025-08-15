import PublicNavigation from '@/components/navigation/PublicNavigation'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PublicNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}