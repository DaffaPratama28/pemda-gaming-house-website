import { cn } from '../lib/cn'

type Props = {
  text: string
  className?: string
  charClassName?: string
}

/**
 * Pecah teks per karakter (masing-masing di dalam mask) untuk animasi masuk.
 * Pembaca layar mendapat teks utuh lewat `sr-only`; potongan visual di-`aria-hidden`.
 */
export function SplitChars({ text, className, charClassName }: Props) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <span key={charIndex} className="split-mask">
                <span className={cn('split-char', charClassName)}>{char}</span>
              </span>
            ))}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  )
}
