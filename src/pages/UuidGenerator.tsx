import { useState } from 'react'
import type { ToolProps } from '../types'

function uuidV4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
	})
}

function nanoid(len = 21) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	const bytes = crypto.getRandomValues(new Uint8Array(len))
	return Array.from(bytes).map(b => chars[b % 64]).join('')
}

function secureToken(bytes = 32) {
	const arr = crypto.getRandomValues(new Uint8Array(bytes))
	return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function UuidGenerator({ showToast, copyToClipboard }: ToolProps) {
	const [uuids, setUuids] = useState<string[]>([])
	const [count, setCount] = useState(5)
	const [nano, setNano] = useState('')
	const [token, setToken] = useState('')

	const generate = () => {
		setUuids(Array.from({ length: count }, uuidV4))
		showToast(`${count} UUIDs generated`, 'success')
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-lg font-semibold text-white">UUID & Tokens</h1>
				<p className="text-sm text-zinc-500 mt-0.5">Generate UUIDs, Nano IDs, and secure random tokens.</p>
			</div>

			{/* UUID v4 */}
			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-medium text-zinc-300">UUID v4</h2>
					<div className="flex items-center gap-2">
						<input
							type="number"
							min={1}
							max={50}
							value={count}
							onChange={e => setCount(Math.max(1, Math.min(50, +e.target.value)))}
							className="w-14 bg-zinc-900 border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-center font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
						/>
						<button onClick={generate} className="btn-primary">Generate</button>
						{uuids.length > 0 && (
							<button onClick={() => { copyToClipboard(uuids.join('\n')); showToast('All copied', 'success') }} className="btn-ghost">Copy All</button>
						)}
					</div>
				</div>
				{uuids.length > 0 && (
					<div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]">
						{uuids.map((id, i) => (
							<div
								key={i}
								onClick={() => { copyToClipboard(id); showToast('Copied', 'success') }}
								className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-white/[0.03] cursor-pointer group"
							>
								<span className="font-mono text-xs text-zinc-300">{id}</span>
								<svg className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</div>
						))}
					</div>
				)}
			</section>

			{/* Nano ID + Token row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<section className="space-y-2">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-medium text-zinc-300">Nano ID</h2>
						<button
							onClick={() => { const id = nanoid(); setNano(id); copyToClipboard(id); showToast('Copied', 'success') }}
							className="btn-ghost text-xs"
						>
							Generate & Copy
						</button>
					</div>
					<div className="px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/[0.07] font-mono text-xs text-indigo-300 break-all min-h-[44px]">
						{nano || <span className="text-zinc-600">—</span>}
					</div>
				</section>

				<section className="space-y-2">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-medium text-zinc-300">Secure Token (hex)</h2>
						<button
							onClick={() => { const t = secureToken(); setToken(t); copyToClipboard(t); showToast('Copied', 'success') }}
							className="btn-ghost text-xs"
						>
							Generate & Copy
						</button>
					</div>
					<div className="px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/[0.07] font-mono text-xs text-emerald-300 break-all min-h-[44px]">
						{token || <span className="text-zinc-600">—</span>}
					</div>
				</section>
			</div>
		</div>
	)
}
