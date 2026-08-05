import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Music2,
  GraduationCap,
  Megaphone,
  ArrowRight,
  Clock,
} from 'lucide-react'
import PageContainer from '../components/PageContainer'
import FeaturedCarousel from '../components/FeaturedCarousel'
import QuickActions from '../components/QuickActions'
import SectionHeader from '../components/SectionHeader'
import HomeCatalogue from '../components/home/HomeCatalogue'
import NewMusicToday from '../components/music/NewMusicToday'
import TalkShowThisWeek from '../components/talkshow/TalkShowThisWeek'
import EventCard from '../components/EventCard'
import { events } from '../data/events'
import { whatsNew, UpdateKind } from '../data/whatsNew'
import { useAuth } from '../state/AuthContext'
import { membershipAccess } from '../state/membershipAccess'

const kindIcon: Record<UpdateKind, typeof Music2> = {
  performance: CalendarDays,
  release: Music2,
  workshop: GraduationCap,
  announcement: Megaphone,
}

export default function Home() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const access = membershipAccess(state)

  return (
    <div className="pt-3">
      {/* Membership prompt for non-active members */}
      {!access.isActiveMember && (
        <PageContainer className="mb-4">
          {access.isSuspended ? (
            <button
              onClick={() => navigate('/membership/status')}
              className="tap flex w-full items-center gap-3 rounded-card border border-error/30 bg-[#F7E9EA] p-4 text-left"
            >
              <Clock className="h-5 w-5 shrink-0 text-error" />
              <span className="flex-1">
                <span className="block text-[14px] font-semibold text-ink">
                  Renew your membership
                </span>
                <span className="block text-[12.5px] text-[#8a3b3b]">
                  Expired · your portfolio is saved · tap to renew
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-error" />
            </button>
          ) : access.isPending ? (
            <button
              onClick={() => navigate('/membership/status')}
              className="tap flex w-full items-center gap-3 rounded-card border border-warning/30 bg-[#F7F0E4] p-4 text-left"
            >
              <Clock className="h-5 w-5 shrink-0 text-warning" />
              <span className="flex-1">
                <span className="block text-[14px] font-semibold text-ink">
                  Finish activating your membership
                </span>
                <span className="block text-[12.5px] text-[#7a5412]">
                  Payment pending · tap to continue
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-warning" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/membership')}
              className="tap flex w-full items-center gap-3 rounded-card border border-border bg-brand-soft p-4 text-left"
            >
              <span className="flex-1">
                <span className="block font-serif text-[17px] leading-tight text-ink">
                  Become an IICA creator
                </span>
                <span className="mt-0.5 block text-[12.5px] text-[#6d3357]">
                  Build a portfolio, sell work and collaborate
                </span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          )}
        </PageContainer>
      )}

      {/* Featured carousel */}
      <div className="mb-4">
        <FeaturedCarousel />
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Explore the Catalogue (compact catalogue entry point) */}
      <div className="mb-8">
        <HomeCatalogue />
      </div>

      {/* What's New */}
      <div className="mb-8">
        <PageContainer>
          <SectionHeader title="What's New" />
        </PageContainer>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-[18px] pb-1">
          {whatsNew.map((u) => {
            const Icon = kindIcon[u.kind]
            return (
              <button
                key={u.id}
                onClick={() => navigate('/explore')}
                className="tap w-[220px] shrink-0 overflow-hidden rounded-card border border-border bg-surface text-left"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-brand-soft">
                  <img
                    src={u.image}
                    alt={u.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
                    <Icon className="h-3.5 w-3.5" /> {u.label}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 text-[14px] font-semibold leading-snug text-ink">
                    {u.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-muted">{u.meta}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* New Music Today (Admin-featured) */}
      <div className="mb-8">
        <NewMusicToday />
      </div>

      {/* Talk Show This Week (Admin-featured) */}
      <div className="mb-8">
        <TalkShowThisWeek />
      </div>

      {/* Upcoming Events */}
      <div className="mb-4">
        <PageContainer>
          <SectionHeader
            title="Upcoming Events"
            action="See all"
            onAction={() => navigate('/events')}
          />
          <div className="flex flex-col gap-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </PageContainer>
      </div>
    </div>
  )
}
