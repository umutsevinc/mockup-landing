import type { Metadata } from 'next'
import HomePage from '../page'

// Prévisualisation de la landing pendant le lock waitlist (/ → /waitlist).
// Non indexée — à retirer (ou garder) au lancement.
export const metadata: Metadata = {
	robots: { index: false, follow: false },
	title: 'Preview — Framer Mockup 3D',
}

export default function PreviewPage() {
	return <HomePage />
}
