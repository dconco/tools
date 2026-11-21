import { useState } from 'react'
import type { ToolProps } from '../types'

function tryDecode(b64: string) {
	try {
		let s = b64.replace(/-/g, '+').replace(/_/g, '/')
		while (s.length % 4) s += '='
		const bin = atob(s)
		const bytes = new Uint8Array(bin.length)
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
		return JSON.stringify(JSON.parse(new TextDecoder().decode(bytes)), null, 2)
	} catch {
		return null
	}
}

export function JwtInspector({ showToast, copyToClipboard }: ToolProps) {
	const [token, setToken] = useState('')
	const [parts, setParts] = useState<string[]>([])
	const [header, setHeader] = useState('')
	const [payload, setPayload] = useState('')
	const [alg, setAlg] = useState('—')
	const [expStr, setExpStr] = useState<{ status: string; label: string; date?: string }>({ status: 'none', label: '—' })
	const [iatStr, setIatStr] = useState('—')

	const decode = (raw: string) => {
		setToken(raw)
		const p = raw.trim().split('.')
		setParts(p)
		if (p.length < 2) { setHeader(''); setPayload(''); setAlg('—'); setExpStr({ status: 'none', label: '—' }); setIatStr('—'); return }
		const h = tryDecode(p[0]) ?? ''
		const pl = tryDecode(p[1]) ?? ''
		setHeader(h)
		setPayload(pl)
		try {
			const hj = JSON.parse(h)
			setAlg(hj.alg ?? '—')
		} catch { setAlg('—') }
		try {
			const pj = JSON.parse(pl)
			if (pj.iat) setIatStr(new Date(pj.iat * 1000).toUTCString())
			else setIatStr('—')
			if (pj.exp) {
				const expDate = new Date(pj.exp * 1000)
				const expired = Date.now() > pj.exp * 1000
				setExpStr({
					status: expired ? 'expired' : 'active',
					label: expired ? 'Expired' : `Active · ${Math.ceil((pj.exp * 1000 - Date.now()) / 60000)}m left`,
					date: expDate.toUTCString()
				})
			} else setExpStr({ status: 'none', label: 'No expiry' })
		} catch { setExpStr({ status: 'none', label: '—' }) }
	}

	const loadSample = () => {
		const now = Math.floor(Date.now() / 1000)
		const h = { alg: 'HS256', typ: 'JWT' }
		const p = { sub: 'usr_dconco', name: 'Dave Conco', iat: now - 120, exp: now + 3600 }
		const enc = (obj: any) => {
			const bytes = new TextEncoder().encode(JSON.stringify(obj))
			let bin = ''
			for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
			return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
		}
		decode(`${enc(h)}.${enc(p)}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`)
		showToast('Sample JWT loaded', 'info')
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-lg font-semibold text-white">JWT Inspector</h1>
					<p className="text-sm text-zinc-500 mt-0.5">Decode and inspect JSON Web Tokens.</p>
				</div>
				<div className="flex gap-2">
					<button onClick={loadSample} className="btn-ghost">Sample</button>
					<button onClick={() => decode('')} className="btn-ghost">Clear</button>
				</div>
			</div>

			{/* Token input */}
			<textarea
				value={token}
				onChange={e => decode(e.target.value)}
				rows={3}
				placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
				className="editor-area"
			/>

			{/* Colour-coded token */}
			{parts.length >= 2 && (
				<div className="px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/[0.07] font-mono text-xs break-all leading-6">
					<span className="text-rose-400">{parts[0]}</span>
					<span className="text-zinc-700">.</span>
					<span className="text-purple-400">{parts[1]}</span>
					{parts[2] && <><span className="text-zinc-700">.</span><span className="text-sky-400">{parts[2]}</span></>}
				</div>
			)}

			{/* Meta row */}
			{(alg !== '—' || iatStr !== '—') && (
				<div className="grid grid-cols-3 gap-3">
					{[
						{ label: 'Algorithm', value: alg, color: 'text-rose-400' },
						{ label: 'Issued At', value: iatStr, color: 'text-zinc-300' },
						{ label: 'Expiration', value: expStr.label, color: expStr.status === 'active' ? 'text-emerald-400' : expStr.status === 'expired' ? 'text-rose-400' : 'text-zinc-400' },
					].map(item => (
						<div key={item.label} className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.07]">
							<div className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{item.label}</div>
							<div className={`text-xs font-mono font-semibold ${item.color} truncate`}>{item.value}</div>
						</div>
					))}
				</div>
			)}

			{/* Header / Payload */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<div className="flex justify-between items-center text-xs">
						<span className="text-rose-400 font-medium">Header</span>
						<button onClick={() => copyToClipboard(header)} className="text-zinc-500 hover:text-zinc-300 transition-colors">Copy</button>
					</div>
					<pre className="editor-area min-h-[160px] text-rose-300/80">{header}</pre>
				</div>
				<div className="space-y-1.5">
					<div className="flex justify-between items-center text-xs">
						<span className="text-purple-400 font-medium">Payload</span>
						<button onClick={() => copyToClipboard(payload)} className="text-zinc-500 hover:text-zinc-300 transition-colors">Copy</button>
					</div>
					<pre className="editor-area min-h-[160px] text-purple-300/80">{payload}</pre>
				</div>
			</div>
		</div>
	)
}
