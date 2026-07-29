'use client'

import {useState, type ReactNode} from 'react'

// <img> de badge annuaire avec repli gracieux. Si l'image ne charge pas
// (404 : listing pas encore validé, endpoint down…), on n'affiche PAS le
// carré « ? » cassé — on bascule sur `fallback` (wordmark texte) ou sur
// rien. Dès que la vraie image redevient disponible, elle réapparaît
// sans autre changement de code.
export default function BadgeImg({
	src,
	alt,
	width,
	height,
	className,
	fallback = null,
}: {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	fallback?: ReactNode
}) {
	const [failed, setFailed] = useState(false)
	if (failed) return <>{fallback}</>
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			loading="lazy"
			decoding="async"
			onError={() => setFailed(true)}
		/>
	)
}
