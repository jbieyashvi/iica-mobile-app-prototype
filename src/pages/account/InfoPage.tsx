import BackHeader from '../../components/BackHeader'

type Kind = 'privacy' | 'help' | 'legal'
interface Block { heading: string; body: string }
interface Content { title: string; intro: string; blocks: Block[] }

const CONTENT: Record<Kind, Content> = {
  privacy: {
    title: 'Privacy',
    intro: 'How IICA handles your information in this prototype.',
    blocks: [
      { heading: 'What we store', body: 'This prototype stores your profile, preferences, cart and orders locally on your device. No data is sent to a server.' },
      { heading: 'What we share', body: 'Nothing is shared with third parties. There is no analytics, advertising or tracking in this build.' },
      { heading: 'Your control', body: 'You can edit your profile, adjust notification settings, or delete your account at any time from this screen.' },
      { heading: 'Payments', body: 'Payment and payout entries are simulated. No real card, bank or UPI details are collected or transmitted.' },
    ],
  },
  help: {
    title: 'Help & Support',
    intro: 'Answers to common questions about using IICA.',
    blocks: [
      { heading: 'Getting started', body: 'Browse Explore to discover artists, events and content. Create a free account to save items and track purchases.' },
      { heading: 'Purchases & access', body: 'Digital products appear in My Library. Physical orders can be tracked from My Orders using your Order ID and email.' },
      { heading: 'Becoming a creator', body: 'Apply for IICA membership to unlock portfolios, content publishing, events, products and AI collaboration.' },
      { heading: 'Managing your account', body: 'Use Edit Profile for personal details and Notification Settings for alerts. Payment Methods and Payout Settings are under Account & Payments.' },
    ],
  },
  legal: {
    title: 'Legal',
    intro: 'Terms and policies for this prototype.',
    blocks: [
      { heading: 'Terms of Use', body: 'This is a demonstration prototype. Features that involve payment, delivery, messaging or verification are simulated for preview purposes only.' },
      { heading: 'Content & IP', body: 'Sample images, names and artist profiles are fictional demo data used to illustrate the experience.' },
      { heading: 'Refund policy', body: 'Refund and return flows shown in Shop are illustrative. No real transactions occur in this build.' },
      { heading: 'Contact', body: 'For the production terms, privacy policy and licensing, refer to the official IICA documentation.' },
    ],
  },
}

export default function InfoPage({ kind }: { kind: Kind }) {
  const c = CONTENT[kind]
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title={c.title} fallback="/profile" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-[22px] pb-8 pt-4">
        <p className="text-[14px] leading-relaxed text-muted">{c.intro}</p>
        <div className="mt-5 flex flex-col divide-y divide-border">
          {c.blocks.map((b) => (
            <div key={b.heading} className="py-4 first:pt-0">
              <h2 className="font-serif text-[17px] leading-tight text-ink">{b.heading}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
