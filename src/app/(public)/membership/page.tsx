import PublicMembership from '@/components/membership/PublicMembership'

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="container mx-auto px-4">
        <PublicMembership />
      </div>
    </div>
  )
}