import {NextResponse} from 'next/server'
import {PREVIEW_COOKIE, previewToken, checkPreviewPassword} from '../auth'

// POST /preview/login — valide le mot de passe côté serveur puis pose
// le cookie httpOnly d'accès. Le mot de passe ne transite qu'ici, il
// n'est jamais renvoyé au client ni inscrit dans le bundle.
export async function POST(req: Request) {
	if (!process.env.PREVIEW_PASSWORD) {
		return NextResponse.json({ok: false, error: 'not_configured'}, {status: 503})
	}
	let password: unknown
	try {
		password = (await req.json())?.password
	} catch {
		return NextResponse.json({ok: false}, {status: 400})
	}
	if (!checkPreviewPassword(password)) {
		return NextResponse.json({ok: false}, {status: 401})
	}
	const res = NextResponse.json({ok: true})
	res.cookies.set(PREVIEW_COOKIE, previewToken(), {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/preview',
		maxAge: 60 * 60 * 24 * 30, // 30 jours
	})
	return res
}
