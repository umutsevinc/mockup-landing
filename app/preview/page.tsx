import type {Metadata} from 'next'
import HomePage from '../page'
import PreviewGate from './PreviewGate'
import {isPreviewAuthed} from './auth'

// Prévisualisation de la landing pendant le lock waitlist (/ → /waitlist).
// Non indexée. L'accès est vérifié CÔTÉ SERVEUR : sans cookie valide,
// on ne renvoie que le formulaire — la vraie landing n'est jamais
// sérialisée dans la réponse tant que le mot de passe n'est pas bon.
export const metadata: Metadata = {
	robots: {index: false, follow: false},
	title: 'Preview — Mockiosa',
}

// Lit le cookie à chaque requête (empêche tout pré-rendu statique qui
// servirait la home sans passer par la gate).
export const dynamic = 'force-dynamic'

export default async function PreviewPage() {
	if (await isPreviewAuthed()) return <HomePage />
	return <PreviewGate />
}
