import type { TabType } from '../types'

interface TabItem {
	id: TabType
	label: string
	path: string
}

interface HeaderProps {
	activeTab: TabType
	onSelectTab: (tab: TabType, path: string) => void
}

export const TABS: TabItem[] = [
	{ id: 'json', label: 'JSON', path: '/json' },
	{ id: 'jwt', label: 'JWT', path: '/jwt' },
	{ id: 'codec', label: 'Codec', path: '/codec' },
	{ id: 'crypto', label: 'Hash', path: '/crypto' },
	{ id: 'uuid', label: 'UUID', path: '/uuid' },
	{ id: 'timestamp', label: 'Epoch', path: '/timestamp' },
]

export function Header({ activeTab, onSelectTab }: HeaderProps) {
	return (
		<header className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl">
			{/* Top accent line */}
			<div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

			<div className="max-w-6xl mx-auto px-6 h-[58px] flex items-center justify-between gap-8">

				{/* Logo */}
				<a
					href="/json"
					data-type="phpspa-link-tag"
					onClick={(e) => { e.preventDefault(); onSelectTab('json', '/json') }}
					className="flex items-center gap-3 shrink-0 group"
				>
					{/* Icon */}
					<div className="relative w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/40 transition-shadow">
						<svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
						</svg>
					</div>
					{/* Wordmark */}
					<div className="flex flex-col leading-none">
						<span className="text-[15px] font-bold text-white tracking-tight">DevVault</span>
						<span className="text-[10px] text-zinc-500 tracking-wide mt-0.5">dev utilities</span>
					</div>
				</a>

				{/* Nav tabs */}
				<nav className="flex items-center overflow-x-auto">
					{TABS.map(tab => {
						const isActive = activeTab === tab.id
						return (
							<a
								key={tab.id}
								href={tab.path}
								data-type="phpspa-link-tag"
								onClick={(e) => { e.preventDefault(); onSelectTab(tab.id, tab.path) }}
								className={`relative px-4 h-[58px] flex items-center text-[13px] font-medium transition-colors whitespace-nowrap ${
									isActive
										? 'text-white'
										: 'text-zinc-500 hover:text-zinc-200'
								}`}
							>
								{tab.label}
								{/* Active underline */}
								{isActive && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-indigo-500" />
								)}
							</a>
						)
					})}
				</nav>

				{/* Right: GitHub */}
				<a
					href="https://github.com/dconco/tools"
					target="_blank"
					rel="noopener noreferrer"
					className="hidden sm:flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all text-xs font-medium"
				>
					<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
						<path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
					</svg>
					GitHub
				</a>
			</div>

			{/* Bottom separator */}
			<div className="h-px bg-white/[0.055]" />
		</header>
	)
}
