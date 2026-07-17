import type { Metadata } from 'next'
import Link from 'next/link'
import { CHANGELOG, type ChangelogMedia } from '@/lib/changelog'

export const metadata: Metadata = {
	title: 'Changelog — Mockiosa',
	description: 'A record of every Mockiosa release, newest first. New devices, animations, export upgrades and fixes.',
	alternates: { canonical: 'https://mockiosa.memselon.com/changelog' },
}

/** Média d'une entrée — vidéo ou image, avec placeholder stylé tant que
 *  le fichier n'est pas déposé dans /public/changelog/ (server-safe :
 *  pas de onError, le placeholder est le poster du conteneur). */
function EntryMedia({ media }: { media: ChangelogMedia }) {
	const src = media.video ?? media.image
	if (!src) return null
	return (
		<figure className="my-8 mx-0">
			<div
				className="relative rounded-[14px] overflow-hidden bg-[#111] border border-white/[0.06]"
				style={{ aspectRatio: media.aspect ?? '16/10' }}
			>
				{/* Placeholder visible sous le média : si le fichier manque,
				    c'est lui qu'on voit (la vidéo 404 reste transparente). */}
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
					<div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">
						{media.video ? 'Video placeholder' : 'Image placeholder'}
					</div>
					<div className="text-xs font-mono text-[#e8702a]">{src}</div>
				</div>
				{media.video ? (
					<video
						src={media.video}
						autoPlay
						muted
						loop
						playsInline
						className="absolute inset-0 w-full h-full object-cover"
					/>
				) : (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={media.image} alt={media.caption ?? ''} className="absolute inset-0 w-full h-full object-cover" />
				)}
			</div>
			{media.caption ? (
				<figcaption className="mt-2.5 text-[13px] text-white/35 leading-relaxed">{media.caption}</figcaption>
			) : null}
		</figure>
	)
}

const KIND_LABEL: Record<string, string> = {
	'✨': 'New',
	'🐛': 'Fix',
	'🎨': 'Design',
	'⚡': 'Perf',
	'🔧': 'Internal',
}

export default function ChangelogPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			{/* Nav minimale */}
			<nav className="flex items-center justify-between px-6 md:px-16 py-5 max-w-[1100px] mx-auto">
				<Link href="/" className="flex items-center gap-2">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
					<span className="font-playfair text-lg">Mockiosa</span>
				</Link>
				<Link
					href="/sign-up"
					className="cta-skeu-light text-gray-900 text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-[1.03]"
				>
					Try it free
				</Link>
			</nav>

			<main className="max-w-[760px] mx-auto px-6 pt-16 pb-32">
				<header className="mb-16">
					<h1 className="text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0 text-white">
						Changelog
					</h1>
					<p className="mt-3 text-base text-white/45 m-0">A record of every release, newest first.</p>
				</header>

				<div className="flex flex-col gap-20">
					{CHANGELOG.map((entry) => (
						<article key={entry.version} id={`v${entry.version}`} className="scroll-mt-24">
							{/* En-tête d'entrée */}
							<div className="flex items-baseline gap-3 flex-wrap mb-1.5">
								<span className="font-mono text-[12px] tracking-[0.04em] text-white/45">v{entry.version}</span>
								<h2 className="text-xl font-medium tracking-[-0.01em] text-white m-0">{entry.name}</h2>
								{entry.highlight ? (
									<span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e8702a]/15 text-[#e8702a]">
										Major
									</span>
								) : null}
								<span className="text-[13px] text-white/30 ml-auto">{entry.date}</span>
							</div>
							<p className="text-base text-white/60 leading-relaxed m-0 mb-5">{entry.headline}</p>

							{/* Story (releases majeures) : paragraphes + médias mêlés */}
							{entry.story?.map((block, i) =>
								typeof block === 'string' ? (
									<p key={i} className="text-[15px] text-white/50 leading-[1.7] m-0 mb-4">
										{block}
									</p>
								) : (
									<EntryMedia key={i} media={block} />
								),
							)}

							{/* Items à badges */}
							<ul className="list-none m-0 mt-6 p-0 flex flex-col gap-3">
								{entry.items.map((item, i) => (
									<li key={i} className="flex items-start gap-3">
										<span
											className="flex-shrink-0 mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-white/55 border border-white/[0.07]"
											title={item.kind}
										>
											{item.kind} {KIND_LABEL[item.kind]}
										</span>
										<span className="text-[15px] text-white/60 leading-[1.6]">{item.text}</span>
									</li>
								))}
							</ul>
						</article>
					))}
				</div>

				<footer className="mt-24 pt-8 border-t border-white/[0.07] flex items-center justify-between text-[13px] text-white/35">
					<Link href="/" className="hover:text-white transition-colors">
						← Back to Mockiosa
					</Link>
					<a href="mailto:hi@memselon.com" className="hover:text-white transition-colors">
						hi@memselon.com
					</a>
				</footer>
			</main>
		</div>
	)
}
