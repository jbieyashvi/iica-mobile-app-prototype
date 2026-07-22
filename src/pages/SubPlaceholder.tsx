import { ReactNode } from 'react'
import BackHeader from '../components/BackHeader'
import EmptyState from '../components/EmptyState'

interface Props {
  headerTitle: string
  icon: ReactNode
  title: string
  description: string
}

export default function SubPlaceholder({
  headerTitle,
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <BackHeader title={headerTitle} />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState icon={icon} title={title} description={description} />
      </div>
    </div>
  )
}
