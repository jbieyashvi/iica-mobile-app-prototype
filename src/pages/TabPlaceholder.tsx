import { ReactNode } from 'react'
import PageContainer from '../components/PageContainer'
import EmptyState from '../components/EmptyState'

interface Props {
  eyebrow: string
  heading: string
  icon: ReactNode
  title: string
  description: string
}

export default function TabPlaceholder({
  eyebrow,
  heading,
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="pt-5">
      <PageContainer>
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-serif text-[30px] leading-tight text-ink">
          {heading}
        </h1>
      </PageContainer>
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  )
}
