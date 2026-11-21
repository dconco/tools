import { useState } from 'react'
import type { ToolProps } from '../types'

const ALGOS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
type Algo = typeof ALGOS[number]

export function CryptoTool({ showToast, copyToClipboard }: ToolProps) {
	const [input, setInput] = useState('')
	const [algo, setAlgo] = useState<Algo>('SHA-256')
	const [results, setResults] = useState<Record<string, string>>({})

	const hash = async () => {
		if (!input.trim()) return
		try {
			const res: Record<string, string> = {}
			const encoded = new TextEncoder().encode(input)
			const webAlgos: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
			for (const a of webAlgos) {
				const buf = await crypto.subtle.digest(a, encoded)
				res[a] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
			}
			// MD5 via API fallback
			try {
				const r = await fetch('/api/hash', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ text: input, algo: 'MD5' })
				})
				if (r.ok) {
					const j = await r.json()
					res['MD5'] = j.hash ?? ''
				}
			} catch { /* MD5 unavailable */ }
			setResults(res)
			showToast('Hashed', 'success')
		} catch (err: any) {
			showToast(err.message, 'error')
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-lg font-semibold text-white">Hash & HMAC</h1>
				<p className="text-sm text-zinc-500 mt-0.5">Generate cryptographic hashes via WebCrypto.</p>
			</div>

			{/* Input */}
			<div className="space-y-3">
				<textarea
					value={input}
					onChange={e => setInput(e.target.value)}
					rows={6}
					placeholder="Enter text to hash…"
					className="editor-area"
				/>
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex gap-1.5">
						{ALGOS.map(a => (
							<button
								key={a}
								onClick={() => setAlgo(a)}
								className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
									algo === a
										? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
										: 'bg-zinc-900/50 border-white/[0.07] text-zinc-500 hover:text-zinc-300'
								}`}
							>
								{a}
							</button>
						))}
					</div>
					<button onClick={hash} className="btn-primary">Hash All</button>
				</div>
			</div>

			{/* Results */}
			{Object.keys(results).length > 0 && (
				<div className="space-y-2">
					{ALGOS.filter(a => results[a]).map(a => (
						<div
							key={a}
							onClick={() => { copyToClipboard(results[a]); showToast(`${a} copied`, 'success') }}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors group ${
								algo === a
									? 'bg-indigo-600/8 border-indigo-500/20'
									: 'bg-zinc-900/50 border-white/[0.06] hover:bg-zinc-800/40'
							}`}
						>
							<span className={`text-[11px] font-mono uppercase tracking-wider w-14 shrink-0 ${algo === a ? 'text-indigo-400' : 'text-zinc-500'}`}>{a}</span>
							<span className="font-mono text-xs text-zinc-300 break-all flex-1">{results[a]}</span>
							<svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
