import type { Metadata } from 'next'
import PreviewGate from './PreviewGate'

// Prévisualisation de la landing pendant le lock waitlist (/ → /waitlist).
// Non indexée — à retirer (ou garder) au lancement.
export const metadata: Metadata = {
	robots: { index: false, follow: false },
	title: 'Preview — Mockiosa',
}

export default function PreviewPage() {
	return <PreviewGate />
}
