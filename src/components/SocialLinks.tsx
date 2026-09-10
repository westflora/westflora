import { SOCIAL_LINKS } from '@/lib/constants'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .56.04.82.12V9.01a6.27 6.27 0 0 0-.82-.05A6.34 6.34 0 0 0 3.16 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.406.042-3.441.219-.937 1.41-5.957 1.41-5.957s-.36-.72-.36-1.781c0-1.668.967-2.914 2.171-2.914 1.024 0 1.518.769 1.518 1.69 0 1.03-.656 2.569-.994 3.995-.283 1.194.6 2.168 1.777 2.168 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.208 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.334 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.042-1.002 2.349-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const icons = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  pinterest: PinterestIcon,
  linkedin: LinkedInIcon,
} as const

type SocialLinksProps = {
  variant?: 'light' | 'dark'
  className?: string
  iconClassName?: string
  showLabel?: boolean
}

export default function SocialLinks({
  variant = 'light',
  className = '',
  iconClassName = 'h-[18px] w-[18px]',
  showLabel = false,
}: SocialLinksProps) {
  const buttonClass =
    variant === 'dark'
      ? 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-[#d4a0a0] transition-all'
      : 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5d5d8] text-[#8a3a3a] hover:bg-[#d4a0a0] hover:text-white transition-colors'

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((link) => {
        const Icon = icons[link.key]
        return (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className={buttonClass}
          >
            <Icon className={iconClassName} />
          </a>
        )
      })}
      {showLabel && <span className="text-sm text-gray-500">Follow West Flora</span>}
    </div>
  )
}
