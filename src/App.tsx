import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import DevicePreview from './components/DevicePreview'
import { GateProvider } from './state/GateContext'
import { useAuth } from './state/AuthContext'
// Events module
import EventCreatorGuard from './components/events/EventCreatorGuard'
import EventsDiscovery from './pages/events/EventsDiscovery'
import EventDetail from './pages/events/EventDetail'
import FreeRegister from './pages/events/FreeRegister'
import TicketSelection from './pages/events/TicketSelection'
import Checkout from './pages/events/Checkout'
import BookingConfirmation from './pages/events/BookingConfirmation'
import MyTickets from './pages/events/MyTickets'
import TicketDetail from './pages/events/TicketDetail'
import StepDetails from './pages/events/create/StepDetails'
import StepSchedule from './pages/events/create/StepSchedule'
import StepVenue from './pages/events/create/StepVenue'
import StepTickets from './pages/events/create/StepTickets'
import StepMedia from './pages/events/create/StepMedia'
import StepPreview from './pages/events/create/StepPreview'
import CreateSuccess from './pages/events/create/CreateSuccess'
import CreatorEvents from './pages/events/creator/CreatorEvents'
import CreatorEventDashboard from './pages/events/creator/CreatorEventDashboard'
import CreatorEventEdit from './pages/events/creator/CreatorEventEdit'
import CreatorAttendees from './pages/events/creator/CreatorAttendees'
// Explore module
import ExploreHome from './pages/explore/ExploreHome'
import ExploreArtists from './pages/explore/ExploreArtists'
import ExploreEvents from './pages/explore/ExploreEvents'
import ExploreContent from './pages/explore/ExploreContent'
import ExploreShop from './pages/explore/ExploreShop'
import ExploreSearch from './pages/explore/ExploreSearch'
import ExploreCategory from './pages/explore/ExploreCategory'
import ExploreTrending from './pages/explore/ExploreTrending'
import ExploreSaved from './pages/explore/ExploreSaved'
import ContentDetail from './pages/explore/ContentDetail'
import ProductDetail from './pages/explore/ProductDetail'
import ShopComing from './pages/explore/ShopComing'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Collaborate from './pages/Collaborate'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Notifications from './pages/Notifications'
import Portfolio from './pages/Portfolio'
import CreateContent from './pages/CreateContent'
import CreateEvent from './pages/CreateEvent'
import EventDetails from './pages/EventDetails'
// Public artist portfolio
import PublicArtistPortfolio from './pages/artist/PublicArtistPortfolio'
import ArtistJourney from './pages/artist/ArtistJourney'
import ArtistReviews from './pages/artist/ArtistReviews'
import ArtistWriteReview from './pages/artist/ArtistWriteReview'
import ArtistCollaborate from './pages/artist/ArtistCollaborate'
import ArtistShare from './pages/artist/ArtistShare'
import ArtistMediaViewer from './pages/artist/ArtistMediaViewer'
import ArtistEventDetails from './pages/artist/ArtistEventDetails'
// Portfolio builder
import PortfolioGuard from './components/portfolio/PortfolioGuard'
import SetupDashboard from './pages/portfolio/SetupDashboard'
import SectionEditor from './pages/portfolio/SectionEditor'
import PortfolioPreview from './pages/portfolio/PortfolioPreview'
import PortfolioPublished from './pages/portfolio/PortfolioPublished'
import PortfolioShare from './pages/portfolio/PortfolioShare'
// Auth
import Welcome from './pages/auth/Welcome'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
// Membership
import MembershipIntro from './pages/membership/MembershipIntro'
import MembershipApplication from './pages/membership/MembershipApplication'
import MembershipSubmitted from './pages/membership/MembershipSubmitted'
import PaymentPending from './pages/membership/PaymentPending'
import PaymentSimulation from './pages/membership/PaymentSimulation'
import MembershipSuccess from './pages/membership/MembershipSuccess'

// Send first-time (not onboarded) visitors to the welcome screen once.
function OnboardingRedirect() {
  const { state } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.onboarded && pathname === '/') {
      navigate('/welcome', { replace: true })
    }
  }, [state.onboarded, pathname, navigate])

  return null
}

export default function App() {
  return (
    <DevicePreview>
      <OnboardingRedirect />
      <GateProvider>
          <Routes>
            {/* Main app (with bottom navigation) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collaborate" element={<Collaborate />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* App sub-screens (no bottom nav) */}
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/create/content" element={<CreateContent />} />
            <Route path="/create/event" element={<CreateEvent />} />
            {/* Public artist portfolio + subflows */}
            <Route path="/artist/:slug" element={<PublicArtistPortfolio />} />
            <Route path="/artist/:slug/journey" element={<ArtistJourney />} />
            <Route path="/artist/:slug/reviews" element={<ArtistReviews />} />
            <Route path="/artist/:slug/write-review" element={<ArtistWriteReview />} />
            <Route path="/artist/:slug/collaborate" element={<ArtistCollaborate />} />
            <Route path="/artist/:slug/share" element={<ArtistShare />} />
            <Route path="/artist/:slug/media/:id" element={<ArtistMediaViewer />} />
            <Route path="/artist/:slug/event/:id" element={<ArtistEventDetails />} />
            <Route path="/event/:id" element={<EventDetails />} />
            {/* Explore discovery */}
            <Route path="/explore" element={<ExploreHome />} />
            <Route path="/explore/artists" element={<ExploreArtists />} />
            <Route path="/explore/events" element={<ExploreEvents />} />
            <Route path="/explore/content" element={<ExploreContent />} />
            <Route path="/explore/shop" element={<ExploreShop />} />
            <Route path="/explore/shop/coming" element={<ShopComing />} />
            <Route path="/explore/search" element={<ExploreSearch />} />
            <Route path="/explore/trending" element={<ExploreTrending />} />
            <Route path="/explore/saved" element={<ExploreSaved />} />
            <Route path="/explore/category/:slug" element={<ExploreCategory />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Events — customer */}
            <Route path="/events" element={<EventsDiscovery />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/register" element={<FreeRegister />} />
            <Route path="/events/:id/tickets" element={<TicketSelection />} />
            <Route path="/events/:id/checkout" element={<Checkout />} />
            <Route path="/events/:id/confirmation" element={<BookingConfirmation />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/my-tickets/:ticketId" element={<TicketDetail />} />

            {/* Events — creator builder (active creators only) */}
            <Route path="/events/create" element={<Navigate to="/events/create/details" replace />} />
            <Route path="/events/create/details" element={<EventCreatorGuard><StepDetails /></EventCreatorGuard>} />
            <Route path="/events/create/schedule" element={<EventCreatorGuard><StepSchedule /></EventCreatorGuard>} />
            <Route path="/events/create/venue" element={<EventCreatorGuard><StepVenue /></EventCreatorGuard>} />
            <Route path="/events/create/tickets" element={<EventCreatorGuard><StepTickets /></EventCreatorGuard>} />
            <Route path="/events/create/media" element={<EventCreatorGuard><StepMedia /></EventCreatorGuard>} />
            <Route path="/events/create/preview" element={<EventCreatorGuard><StepPreview /></EventCreatorGuard>} />
            <Route path="/events/create/success" element={<EventCreatorGuard><CreateSuccess /></EventCreatorGuard>} />

            {/* Events — creator management */}
            <Route path="/creator/events" element={<EventCreatorGuard><CreatorEvents /></EventCreatorGuard>} />
            <Route path="/creator/events/:id" element={<EventCreatorGuard><CreatorEventDashboard /></EventCreatorGuard>} />
            <Route path="/creator/events/:id/edit" element={<EventCreatorGuard><CreatorEventEdit /></EventCreatorGuard>} />
            <Route path="/creator/events/:id/attendees" element={<EventCreatorGuard><CreatorAttendees /></EventCreatorGuard>} />

            {/* Portfolio builder (active members only) */}
            <Route
              path="/portfolio/setup"
              element={
                <PortfolioGuard>
                  <SetupDashboard />
                </PortfolioGuard>
              }
            />
            <Route
              path="/portfolio/edit/:section"
              element={
                <PortfolioGuard>
                  <SectionEditor />
                </PortfolioGuard>
              }
            />
            <Route
              path="/portfolio/preview"
              element={
                <PortfolioGuard>
                  <PortfolioPreview />
                </PortfolioGuard>
              }
            />
            <Route
              path="/portfolio/published"
              element={
                <PortfolioGuard>
                  <PortfolioPublished />
                </PortfolioGuard>
              }
            />
            <Route
              path="/portfolio/share"
              element={
                <PortfolioGuard>
                  <PortfolioShare />
                </PortfolioGuard>
              }
            />

            {/* Auth (no bottom nav) */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Membership (no bottom nav) */}
            <Route path="/membership" element={<MembershipIntro />} />
            <Route path="/membership/application" element={<MembershipApplication />} />
            <Route path="/membership/submitted" element={<MembershipSubmitted />} />
            <Route path="/membership/payment-pending" element={<PaymentPending />} />
            <Route path="/membership/payment-simulation" element={<PaymentSimulation />} />
            <Route path="/membership/success" element={<MembershipSuccess />} />
          </Routes>
        </GateProvider>
    </DevicePreview>
  )
}
