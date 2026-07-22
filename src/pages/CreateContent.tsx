import { PenLine } from 'lucide-react'
import SubPlaceholder from './SubPlaceholder'

export default function CreateContent() {
  return (
    <SubPlaceholder
      headerTitle="Create Content"
      icon={<PenLine className="h-7 w-7" strokeWidth={1.6} />}
      title="Share your creative work"
      description="Post music, art, writing and behind-the-scenes moments. The content composer will be built next."
    />
  )
}
