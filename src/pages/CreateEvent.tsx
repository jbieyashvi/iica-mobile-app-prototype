import { CalendarPlus } from 'lucide-react'
import SubPlaceholder from './SubPlaceholder'

export default function CreateEvent() {
  return (
    <SubPlaceholder
      headerTitle="Create Event"
      icon={<CalendarPlus className="h-7 w-7" strokeWidth={1.6} />}
      title="Host an event"
      description="Set up performances, workshops and exhibitions with free or paid tickets. The event builder will be built next."
    />
  )
}
