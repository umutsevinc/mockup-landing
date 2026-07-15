'use client'

import {useEffect, useRef, useState} from 'react'

/** Visibilité viewport d'un élément — sert à couper le frameloop R3F
 *  des canvases hors écran (perf : follow-cursor, float, vidéo). */
export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = '100px') {
	const ref = useRef<T | null>(null)
	const [inView, setInView] = useState(true)
	useEffect(() => {
		const el = ref.current
		if (!el || typeof IntersectionObserver === 'undefined') return
		const io = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{rootMargin},
		)
		io.observe(el)
		return () => io.disconnect()
	}, [rootMargin])
	return {ref, inView}
}
