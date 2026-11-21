import { useState, useEffect, useRef } from 'react'
import type { ToolProps } from '../types'

function relative(ts: number) {
	const diff = Math.round((Date.now() / 1000 - ts))
	if (diff < 60) return `${diff}s ago`
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
	return `${Math.floor(diff / 86400)}d ago`
}

export function TimestampConverter({ showToast, copyToClipboard }: ToolProps) {
	const [now, setNow] = useState(new Date())
	const [paused, setPaused] = useState(false)
	const [epochIn, setEpochIn] = useState('')
	const [dateIn, setDateIn] = useState('')
	const [dateRes, setDateRes] = useState<{ iso: string; utc: string; local: string; relative: string } | null>(null)
	const [epochRes, setEpochRes] = useState<{ sec: string; ms: string } | null>(null)
	const ref = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		if (!paused) {
			ref.current = setInterval(() => setNow(new Date()), 1000)
		}
		return () => { if (ref.current) clearInterval(ref.current) }
	}, [paused])

	const convertEpoch = () => {
		const ts = parseInt(epochIn)
		if (isNaN(ts)) { showToast('Invalid epoch', 'error'); return }
		const d = new Date(ts < 1e10 ? ts * 1000 : ts)
		setDateRes({ iso: d.toISOString(), utc: d.toUTCString(), local: d.toLocaleString(), relative: relative(ts < 1e10 ? ts : ts / 1000) })
	}

	const convertDate = () => {
		const d = new Date(dateIn)
		if (isNaN(d.getTime())) { showToast('Invalid date', 'error'); return }
		setEpochRes({ sec: String(Math.floor(d.getTime() / 1000)), ms: String(d.getTime()) })
	}

	const epoch = Math.floor(now.getTime() / 1000)

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-lg font-semibold text-white">Epoch Converter</h1>
				<p className="text-sm text-zinc-500 mt-0.5">Unix timestamp clock and bidirectional date converter.</p>
			</div>

			{/* Live clock */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/[0.07]">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<span className={`w-2 h-2 rounded-full ${paused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
						<span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Unix Epoch</span>
					</div>
					<div className="flex items-baseline gap-3">
						<span
							className="text-3xl sm:text-4xl font-mono font-bold text-white select-all cursor-pointer"
							onClick={() => { copyToClipboard(String(epoch)); showToast('Copied', 'success') }}
						>
							{epoch}
						</span>
						<span className="text-xs text-zinc-500 font-mono">sec</span>
					</div>
					<p className="text-xs text-zinc-500 font-mono mt-1">{now.toUTCString()}</p>
				</div>
				<div className="flex gap-2">
					<button onClick={() => setPaused(p => !p)} className="btn-ghost">
						{paused ? 'Resume' : 'Pause'}
					</button>
					<button onClick={() => { copyToClipboard(String(epoch)); showToast('Copied', 'success') }} className="btn-primary">
						Copy
					</button>
				</div>
			</div>

			{/* Converters */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				{/* Epoch → Date */}
				<div className="space-y-3">
					<h2 className="text-sm font-medium text-zinc-300">Epoch → Date</h2>
					<div className="flex gap-2">
						<input
							type="text"
							value={epochIn}
							onChange={e => setEpochIn(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && convertEpoch()}
							placeholder="1795271818"
							className="flex-1 bg-zinc-900/60 border border-white/[0.08] rounded-xl px-4 py-2.5 font-mono text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/60 transition-colors"
						/>
						<button onClick={convertEpoch} className="btn-primary">Convert</button>
					</div>
					{dateRes && (
						<div className="space-y-1.5">
							{[
								{ label: 'ISO 8601', value: dateRes.iso, color: 'text-emerald-400' },
								{ label: 'UTC', value: dateRes.utc, color: 'text-zinc-300' },
								{ label: 'Local', value: dateRes.local, color: 'text-zinc-300' },
								{ label: 'Relative', value: dateRes.relative, color: 'text-indigo-400' },
							].map(r => (
								<div key={r.label} className="flex gap-3 items-baseline px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/[0.05]">
									<span className="text-[11px] text-zinc-600 w-14 shrink-0">{r.label}</span>
									<span className={`font-mono text-xs ${r.color} truncate select-all`}>{r.value}</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Date → Epoch */}
				<div className="space-y-3">
					<h2 className="text-sm font-medium text-zinc-300">Date → Epoch</h2>
					<div className="flex gap-2">
						<input
							type="datetime-local"
							value={dateIn}
							onChange={e => setDateIn(e.target.value)}
							className="flex-1 bg-zinc-900/60 border border-white/[0.08] rounded-xl px-4 py-2.5 font-mono text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/60 transition-colors"
						/>
						<button onClick={convertDate} className="btn-primary">Convert</button>
					</div>
					{epochRes && (
						<div className="space-y-1.5">
							{[
								{ label: 'Seconds', value: epochRes.sec, color: 'text-indigo-400' },
								{ label: 'Milliseconds', value: epochRes.ms, color: 'text-zinc-300' },
							].map(r => (
								<div
									key={r.label}
									onClick={() => { copyToClipboard(r.value); showToast('Copied', 'success') }}
									className="flex gap-3 items-baseline px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/[0.05] cursor-pointer hover:bg-zinc-800/40 transition-colors"
								>
									<span className="text-[11px] text-zinc-600 w-20 shrink-0">{r.label}</span>
									<span className={`font-mono text-sm font-semibold ${r.color} select-all`}>{r.value}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
