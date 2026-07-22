interface Props {
  onGoogle: () => void
  onApple: () => void
}

// Brand glyphs drawn inline (Lucide has no brand icons). Kept minimal + monochrome-friendly.
export default function SocialButtons({ onGoogle, onApple }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={onGoogle}
        className="tap flex min-h-[46px] items-center justify-center gap-2.5 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink transition-colors hover:border-ink/25"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.92a9 9 0 0 0 0 8.1l3.05-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .92 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </button>
      <button
        type="button"
        onClick={onApple}
        className="tap flex min-h-[46px] items-center justify-center gap-2.5 rounded-control border border-border bg-surface text-[14px] font-semibold text-ink transition-colors hover:border-ink/25"
      >
        <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden>
          <path d="M13.1 9.6c0-2.02 1.65-2.99 1.72-3.03-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.42.73-3.05.73-.63 0-1.6-.71-2.63-.69-1.35.02-2.6.79-3.3 2-1.4 2.44-.36 6.05 1.01 8.03.67.97 1.47 2.06 2.51 2.02 1.01-.04 1.39-.65 2.61-.65 1.22 0 1.56.65 2.63.63 1.09-.02 1.78-.99 2.44-1.96.77-1.12 1.09-2.21 1.11-2.27-.02-.01-2.13-.82-2.15-3.24ZM11.1 3.7c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.86 2.48.9.07 1.83-.46 2.39-1.14Z" />
        </svg>
        Continue with Apple
      </button>
    </div>
  )
}
