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
// Shop module
import ShopHome from './pages/shop/ShopHome'
import ShopSearch from './pages/shop/ShopSearch'
import ShopCategory from './pages/shop/ShopCategory'
import ShopProductDetail from './pages/shop/ProductDetail'
import Cart from './pages/shop/Cart'
import ShopCheckout from './pages/shop/Checkout'
import CheckoutAddress from './pages/shop/CheckoutAddress'
import CheckoutPayment from './pages/shop/CheckoutPayment'
import CheckoutConfirmation from './pages/shop/CheckoutConfirmation'
import Orders from './pages/shop/Orders'
import OrderDetails from './pages/shop/OrderDetails'
import Library from './pages/shop/Library'
import MasterclassPlayer from './pages/shop/MasterclassPlayer'
import RefundRequest from './pages/shop/RefundRequest'
import ProductCreateEntry from './pages/shop/create/ProductCreateEntry'
import StepPDetails from './pages/shop/create/StepPDetails'
import StepPContent from './pages/shop/create/StepPContent'
import StepPPricing from './pages/shop/create/StepPPricing'
import StepPDelivery from './pages/shop/create/StepPDelivery'
import StepPMedia from './pages/shop/create/StepPMedia'
import StepPPreview from './pages/shop/create/StepPPreview'
import StepPSuccess from './pages/shop/create/StepPSuccess'
import CreatorProducts from './pages/shop/creator/CreatorProducts'
import CreatorProductManage from './pages/shop/creator/CreatorProductManage'
import CreatorShopOrders from './pages/shop/creator/CreatorOrders'
import CreatorShopOrderDetails from './pages/shop/creator/CreatorOrderDetails'
import CreatorEarnings from './pages/shop/creator/CreatorEarnings'
import CreatorPayouts from './pages/shop/creator/CreatorPayouts'
import ExploreSearch from './pages/explore/ExploreSearch'
import ExploreCategory from './pages/explore/ExploreCategory'
import ExploreTrending from './pages/explore/ExploreTrending'
import ExploreSaved from './pages/explore/ExploreSaved'
import ContentDetail from './pages/explore/ContentDetail'
import ShopComing from './pages/explore/ShopComing'
import Home from './pages/Home'
// Collaborate module
import CollaborateHome from './pages/collaborate/CollaborateHome'
import CollabPreferences from './pages/collaborate/Preferences'
import CollabDiscover from './pages/collaborate/Discover'
import CollabRecommendations from './pages/collaborate/Recommendations'
import CollabMatchDetails from './pages/collaborate/MatchDetails'
import CollabRequestForm from './pages/collaborate/RequestForm'
import CollabRequestsDashboard from './pages/collaborate/RequestsDashboard'
import CollabRequestDetails from './pages/collaborate/RequestDetails'
import CollabMeetings from './pages/collaborate/Meetings'
import CollabMeetingDetails from './pages/collaborate/MeetingDetails'
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
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Shop module */}
            <Route path="/shop" element={<ShopHome />} />
            <Route path="/shop/search" element={<ShopSearch />} />
            <Route path="/shop/category/:category" element={<ShopCategory />} />
            <Route path="/product/:id" element={<ShopProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ShopCheckout />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:itemId" element={<MasterclassPlayer />} />
            <Route path="/refunds/:orderId/request" element={<RefundRequest />} />
            {/* Shop — creator (active only) */}
            <Route path="/creator/products" element={<EventCreatorGuard><CreatorProducts /></EventCreatorGuard>} />
            <Route path="/creator/products/create" element={<EventCreatorGuard><ProductCreateEntry /></EventCreatorGuard>} />
            <Route path="/creator/products/create/details" element={<EventCreatorGuard><StepPDetails /></EventCreatorGuard>} />
            <Route path="/creator/products/create/content" element={<EventCreatorGuard><StepPContent /></EventCreatorGuard>} />
            <Route path="/creator/products/create/pricing" element={<EventCreatorGuard><StepPPricing /></EventCreatorGuard>} />
            <Route path="/creator/products/create/delivery" element={<EventCreatorGuard><StepPDelivery /></EventCreatorGuard>} />
            <Route path="/creator/products/create/media" element={<EventCreatorGuard><StepPMedia /></EventCreatorGuard>} />
            <Route path="/creator/products/create/preview" element={<EventCreatorGuard><StepPPreview /></EventCreatorGuard>} />
            <Route path="/creator/products/create/success" element={<EventCreatorGuard><StepPSuccess /></EventCreatorGuard>} />
            <Route path="/creator/products/:id" element={<EventCreatorGuard><CreatorProductManage /></EventCreatorGuard>} />
            <Route path="/creator/orders" element={<EventCreatorGuard><CreatorShopOrders /></EventCreatorGuard>} />
            <Route path="/creator/orders/:orderId" element={<EventCreatorGuard><CreatorShopOrderDetails /></EventCreatorGuard>} />
            <Route path="/creator/earnings" element={<EventCreatorGuard><CreatorEarnings /></EventCreatorGuard>} />
            <Route path="/creator/payouts" element={<EventCreatorGuard><CreatorPayouts /></EventCreatorGuard>} />

            {/* Collaborate module (bottom nav on home/requests/meetings via their own render) */}
            <Route path="/collaborate" element={<CollaborateHome />} />
            <Route path="/collaborate/preferences" element={<CollabPreferences />} />
            <Route path="/collaborate/discover" element={<CollabDiscover />} />
            <Route path="/collaborate/recommendations" element={<CollabRecommendations />} />
            <Route path="/collaborate/match/:artistId" element={<CollabMatchDetails />} />
            <Route path="/collaborate/request/:artistId" element={<CollabRequestForm />} />
            <Route path="/collaborate/requests" element={<CollabRequestsDashboard />} />
            <Route path="/collaborate/requests/:requestId" element={<CollabRequestDetails />} />
            <Route path="/collaborate/meetings" element={<CollabMeetings />} />
            <Route path="/collaborate/meetings/:meetingId" element={<CollabMeetingDetails />} />

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
