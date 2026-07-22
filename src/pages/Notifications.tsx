import { Bell } from 'lucide-react'
import SubPlaceholder from './SubPlaceholder'

export default function Notifications() {
  return (
    <SubPlaceholder
      headerTitle="Notifications"
      icon={<Bell className="h-7 w-7" strokeWidth={1.6} />}
      title="You're all caught up"
      description="Collaboration requests, event reminders and community updates will appear here."
    />
  )
}
