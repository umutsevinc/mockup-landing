import Link from 'next/link'

/**
 * 404 — Next.js App Router : ce fichier remplace la page 404 par défaut
 * pour toute route qui n'existe pas (typo dans URL, backlink cassé, etc).
 *
 * Style aligné sur le reste de la landing : bg noir, plume Mockiosa qui
 * lévite, wordmark Playfair italique, wording clin d'œil au thème 3D
 * flottant ("this page floated away"). Deux CTA : retour home
 * (marketing) et retour Framer (pour ne pas perdre les users authentifiés
 * qui cherchent le plugin).
 */

export const metadata = {
	title: '404 — Mockiosa',
	description: 'This page floated away. Head back to the home or open Mockiosa in Framer.',
	robots: {index: false, follow: false},
}

export default function NotFound() {
	return (
		<div className="min-h-screen bg-black text-white flex flex-col tracking-[-0.02em] overflow-hidden">
			{/* ── nav ── */}
			<nav className="flex items-center justify-between p-4 sm:p-5">
				<Link href="/" className="flex items-center gap-2.5">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/feather-pen-white.svg?v=7" alt="Mockiosa" width="22" height="24" aria-hidden="true" />
					<span className="text-lg font-playfair">Mockiosa</span>
				</Link>
				<Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
					← Back to home
				</Link>
			</nav>

			{/* ── content centré ── */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-16">
				{/* Plume qui lévite en boucle — clin d'œil au « Float » plan. */}
				<div className="relative mb-10 float-ease">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/feather-pen-white.svg?v=7"
						alt=""
						width={72}
						height={72}
						aria-hidden="true"
						className="opacity-90"
					/>
					{/* Ombre douce sous la plume — accentue l'effet flottant. */}
					<div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-16 h-2 rounded-full bg-white/10 blur-md" />
				</div>

				<h1 className="font-playfair italic text-[88px] sm:text-[128px] leading-none m-0 tracking-[-0.04em]">
					404
				</h1>

				<p className="mt-6 mb-2 text-2xl sm:text-3xl font-normal tracking-[-0.02em]">
					This page <span className="text-white/45">floated away.</span>
				</p>
				<p className="text-sm sm:text-base text-white/55 max-w-md leading-relaxed">
					The link you followed doesn&apos;t exist here. It may have been renamed, moved, or it never
					existed in the first place.
				</p>

				<div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
					<Link
						href="/"
						className="cta-skeu text-white text-sm font-semibold px-6 py-3 rounded-full transition-all hover:scale-[1.02]"
					>
						Take me home
					</Link>
					<a
						href="https://framer.com/projects/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/70 hover:text-white text-sm font-medium px-6 py-3 rounded-full underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
					>
						Open Mockiosa in Framer →
					</a>
				</div>
			</main>

			{/* ── footer signature ── */}
			<footer className="p-6 flex items-center justify-center">
				<p className="text-[11px] text-white/35">
					Build with 🫰 by{' '}
					<a
						href="https://x.com/memselon"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/55 hover:text-white transition-colors"
					>
						Memselon
					</a>
					{' & '}
					<a
						href="https://x.com/meiiyve"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/55 hover:text-white transition-colors"
					>
						May
					</a>
				</p>
			</footer>

			{/* Animation CSS de flottement — pareille intention que le
			    « Float » preset 3D. Amplitude minime, easing doux. */}
			<style>{`
				@keyframes float-y {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-10px); }
				}
				.float-ease {
					animation: float-y 3.6s ease-in-out infinite;
				}
			`}</style>
		</div>
	)
}
