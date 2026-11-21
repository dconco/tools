export function Footer() {
	return (
		<footer className="mt-auto">
			{/* Top separator */}
			<div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

			<div className="max-w-6xl mx-auto px-6 py-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">

					{/* Left: brand */}
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-lg bg-indigo-600/80 flex items-center justify-center">
							<svg className="w-3.5 h-3.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
							</svg>
						</div>
						<div className="text-xs text-zinc-600 leading-snug">
							<span className="text-zinc-400 font-medium">DevVault</span>
							{' '}by{' '}
							<a
								href="https://dconco.net"
								target="_blank"
								rel="noopener noreferrer"
								className="text-zinc-400 hover:text-white transition-colors"
							>
								Dave Conco
							</a>
							<span className="mx-2 text-zinc-800">·</span>
							<span>MIT License</span>
						</div>
					</div>

					{/* Right: links */}
					<nav className="flex items-center gap-1">
						{[
							{ label: 'PhpSPA', href: 'https://github.com/dconco/phpspa' },
							{ label: 'Source', href: 'https://github.com/dconco/tools' },
							{ label: 'Portfolio', href: 'https://dconco.net' },
						].map((link, i, arr) => (
							<span key={link.label} className="flex items-center">
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors px-2 py-1"
								>
									{link.label}
								</a>
								{i < arr.length - 1 && (
									<span className="w-px h-3 bg-white/[0.08]" />
								)}
							</span>
						))}
					</nav>
				</div>
			</div>
		</footer>
	)
}
