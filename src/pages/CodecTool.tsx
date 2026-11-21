import { useState } from 'react'
import type { ToolProps } from '../types'

type Mode = { key: string; label: string }

const MODES: Mode[] = [
	{ key: 'b64e', label: 'Base64 Encode' },
	{ key: 'b64d', label: 'Base64 Decode' },
	{ key: 'b64urle', label: 'Base64URL Encode' },
	{ key: 'b64urld', label: 'Base64URL Decode' },
	{ key: 'urle', label: 'URL Encode' },
	{ key: 'urld', label: 'URL Decode' },
	{ key: 'hexe', label: 'Hex Encode' },
	{ key: 'hexd', label: 'Hex Decode' },
]

export function CodecTool({ showToast, copyToClipboard }: ToolProps) {
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [active, setActive] = useState<string | null>(null)

	const run = (mode: string) => {
		if (!input) return
		setActive(mode)
		try {
			let res = ''
			if (mode === 'b64e') {
				const bytes = new TextEncoder().encode(input)
				let bin = ''
				for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
				res = btoa(bin)
			} else if (mode === 'b64d') {
				let s = input.trim().replace(/\s+/g, '')
				while (s.length % 4) s += '='
				const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
				const bytes = new Uint8Array(bin.length)
				for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
				res = new TextDecoder().decode(bytes)
			} else if (mode === 'b64urle') {
				const bytes = new TextEncoder().encode(input)
				let bin = ''
				for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
				res = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
			} else if (mode === 'b64urld') {
				let s = input.trim().replace(/-/g, '+').replace(/_/g, '/')
				while (s.length % 4) s += '='
				const bin = atob(s)
				const bytes = new Uint8Array(bin.length)
				for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
				res = new TextDecoder().decode(bytes)
			} else if (mode === 'urle') {
				res = encodeURIComponent(input)
			} else if (mode === 'urld') {
				res = decodeURIComponent(input)
			} else if (mode === 'hexe') {
				const bytes = new TextEncoder().encode(input)
				res = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
			} else if (mode === 'hexd') {
				const clean = input.replace(/[^0-9a-fA-F]/g, '')
				if (clean.length % 2) throw new Error('Odd hex length')
				const bytes = new Uint8Array(clean.length / 2)
				for (let i = 0; i < clean.length; i += 2) bytes[i / 2] = parseInt(clean.substr(i, 2), 16)
				res = new TextDecoder().decode(bytes)
			}
			setOutput(res)
			showToast('Done', 'success')
		} catch (err: any) {
			setOutput('Error: ' + err.message)
			showToast(err.message, 'error')
		}
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-lg font-semibold text-white">Codec</h1>
					<p className="text-sm text-zinc-500 mt-0.5">Encode and decode Base64, URL, and Hex.</p>
				</div>
				<div className="flex gap-2">
					<button onClick={() => { const t = input; setInput(output); setOutput(t) }} className="btn-ghost">Swap</button>
					<button onClick={() => { setInput(''); setOutput(''); setActive(null) }} className="btn-ghost">Clear</button>
					<button onClick={() => copyToClipboard(output)} className="btn-primary">Copy Output</button>
				</div>
			</div>

			{/* Mode selector */}
			<div className="flex flex-wrap gap-2">
				{MODES.map(m => (
					<button
						key={m.key}
						onClick={() => run(m.key)}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
							active === m.key
								? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
								: 'bg-zinc-900/60 border-white/[0.07] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
						}`}
					>
						{m.label}
					</button>
				))}
			</div>

			{/* Editors */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<label className="text-xs text-zinc-500">Input</label>
					<textarea value={input} onChange={e => setInput(e.target.value)} rows={16} placeholder="Paste text here…" className="editor-area" />
				</div>
				<div className="space-y-1.5">
					<label className="text-xs text-zinc-500">Output</label>
					<textarea value={output} readOnly rows={16} placeholder="Result appears here…" className="editor-area text-emerald-300/80" />
				</div>
			</div>
		</div>
	)
}
