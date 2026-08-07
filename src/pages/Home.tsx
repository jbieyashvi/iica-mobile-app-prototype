import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import FeaturedCarousel from '../components/FeaturedCarousel'
import QuickActions from '../components/QuickActions'
import HomeCatalogue from '../components/home/HomeCatalogue'
import NewMusicToday from '../components/music/NewMusicToday'
import TalkShowThisWeek from '../components/talkshow/TalkShowThisWeek'
import RecommendedHome from '../components/recommend/RecommendedHome'
import { useAuth } from '../state/AuthContext'
import { membershipAccess } from '../state/membershipAccess'

// Mobile Home order:
//   1. Membership prompt (non-members) · 2. Featured carousel · 3. Quick actions
//   4. Explore the Catalogue · 5. New Music Today · 6. Featured Talk Show
//   7. Admin-curated Recommended Listings carousel
// What's New, Talk Show "Previous Episodes" and the standalone Upcoming Events
// section were removed per PM. Sections self-hide cleanly (no blank gaps); the
// underlying products / classes / events / episodes are untouched.
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

      {/* New Music Today (Admin-featured) */}
      <div className="mb-8">
        <NewMusicToday />
      </div>

      {/* Talk Show This Week (Admin-featured; self-hides if none featured) */}
      <div className="mb-8">
        <TalkShowThisWeek />
      </div>

      {/* Recommended Listings (Admin-curated infinite carousel; self-hides with
          no blank spacing when there's nothing valid to show) */}
      <RecommendedHome />
    </div>
  )
}
