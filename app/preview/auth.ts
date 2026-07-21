// Ce module est de-facto serveur : `next/headers` ne peut pas être
// importé côté client (erreur de build), donc rien ici n'atteint le bundle.
import {cookies} from 'next/headers'
import {createHash, timingSafeEqual} from 'crypto'

// Accès à la preview de la landing (lock pré-lancement). TOUT est
// serveur : le mot de passe vit dans PREVIEW_PASSWORD (jamais dans le
// bundle client), la validation se fait ici, et un cookie httpOnly
// opaque prouve l'accès. Aucun secret n'atteint le navigateur.

export const PREVIEW_COOKIE = 'preview_auth'

/** Jeton opaque = sha256(password + secret serveur). Posé en cookie
 *  httpOnly après saisie correcte ; infalsifiable sans le mot de passe. */
export function previewToken(): string {
	const pw = process.env.PREVIEW_PASSWORD ?? ''
	const secret = process.env.PREVIEW_SECRET ?? 'mockiosa-preview-v1'
	return createHash('sha256').update(`${pw}::${secret}`).digest('hex')
}

/** Comparaison à temps constant (évite le timing-attack sur l'égalité). */
function safeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a)
	const bb = Buffer.from(b)
	if (ab.length !== bb.length) return false
	return timingSafeEqual(ab, bb)
}

/** Le cookie d'accès est-il présent et valide ? Fail-closed si aucun
 *  mot de passe n'est configuré (personne n'entre tant que l'env n'est
 *  pas posée). */
export async function isPreviewAuthed(): Promise<boolean> {
	if (!process.env.PREVIEW_PASSWORD) return false
	const jar = await cookies()
	const val = jar.get(PREVIEW_COOKIE)?.value
	if (!val) return false
	return safeEqual(val, previewToken())
}

/** Le mot de passe saisi correspond-il à PREVIEW_PASSWORD ? */
export function checkPreviewPassword(input: unknown): boolean {
	const pw = process.env.PREVIEW_PASSWORD
	if (!pw || typeof input !== 'string') return false
	return safeEqual(input, pw)
}
