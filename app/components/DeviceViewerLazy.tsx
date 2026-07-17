'use client'

import dynamic from 'next/dynamic'

/** Wrapper client pour charger le viewer 3D sans SSR depuis les pages
 *  serveur /mockups/[slug] (Canvas WebGL = client only). */
const DeviceMockupViewer = dynamic(() => import('./DeviceMockupViewer'), {
	ssr: false,
	loading: () => (
		<div
			className="h-[420px] md:h-[540px] rounded-3xl bg-white/[0.03] border border-white/[0.07] animate-pulse"
			aria-hidden="true"
		/>
	),
})

export default DeviceMockupViewer
