import { Users } from 'lucide-react'
import TabPlaceholder from './TabPlaceholder'

export default function Collaborate() {
  return (
    <TabPlaceholder
      eyebrow="Connect"
      heading="Collaborate"
      icon={<Users className="h-7 w-7" strokeWidth={1.6} />}
      title="AI-matched collaborators coming soon"
      description="Discover recommended artists, send collaboration requests and manage responses. This section will be built next."
    />
  )
}
