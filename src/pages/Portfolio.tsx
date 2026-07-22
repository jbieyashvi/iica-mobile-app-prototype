import { FolderOpen } from 'lucide-react'
import SubPlaceholder from './SubPlaceholder'

export default function Portfolio() {
  return (
    <SubPlaceholder
      headerTitle="My Portfolio"
      icon={<FolderOpen className="h-7 w-7" strokeWidth={1.6} />}
      title="Build your portfolio"
      description="Showcase your journey, awards, collaborations, events and media. The portfolio editor will be built next."
    />
  )
}
