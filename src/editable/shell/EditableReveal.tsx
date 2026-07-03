'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/*
  Fade + slide-up scroll reveal.

  The hidden ("armed") state is applied ONLY after mount, so JS-off visitors
  see content immediately. Uses `var(--ease-premium)` and honours
  prefers-reduced-motion via the global CSS layer.
*/

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index — element delays by index * step */
  index?: number
  /** Milliseconds between staggered items */
  step?: number
  /** Extra classes on the wrapper */
  className?: string
  /** Wrapper element (block vs inline) */
  as?: 'div' | 'span' | 'section' | 'header' | 'article' | 'li' | 'ul'
  /** Base delay in ms (added to index * step) */
  delay?: number
}

export function EditableReveal({
  children,
  index = 0,
  step = 80,
  className = '',
  as: Tag = 'div',
  delay = 0,
}: EditableRevealProps) {
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setArmed(true)
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const totalDelay = delay + index * step
  const style: CSSProperties = { transitionDelay: `${totalDelay}ms` }
  const cls = [
    'editable-reveal',
    armed ? 'editable-reveal-armed' : '',
    armed && visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref as never} className={cls} style={style}>
      {children}
    </Tag>
  )
}
