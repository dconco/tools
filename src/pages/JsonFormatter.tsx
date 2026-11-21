import { useState } from 'react'
import type { ToolProps } from '../types'

export function JsonFormatter({ showToast, copyToClipboard }: ToolProps) {
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [status, setStatus] = useState<{ valid: boolean; message: string } | null>(null)

	const format = (indent: number) => {
		if (!input.trim()) { setOutput(''); setStatus(null); return }
		try {
			const parsed = JSON.parse(input)
			const res = JSON.stringify(parsed, null, indent)
			setOutput(res)
			setStatus({ valid: true, message: 'Valid JSON' })
			showToast('Formatted', 'success')
		} catch (err: any) {
			setStatus({ valid: false, message: err.message })
		}
	}

	const sortKeys = () => {
		if (!input.trim()) return
		try {
			const parsed = JSON.parse(input)
			const sortObj = (obj: any): any => {
				if (Array.isArray(obj)) return obj.map(sortObj)
				if (obj !== null && typeof obj === 'object') {
					return Object.keys(obj).sort().reduce((res: any, key) => {
						res[key] = sortObj(obj[key])
						return res
					}, {})
				}
				return obj
			}
			setOutput(JSON.stringify(sortObj(parsed), null, 2))
			showToast('Keys sorted', 'success')
		} catch {
			showToast('Invalid JSON', 'error')
		}
	}

	const loadSample = () => {
		const sample = {
			project: 'DevVault',
			author: 'Dave Conco',
			stack: { backend: 'PhpSPA 2.1', frontend: 'React 19 + Vite 8' },
			timestamp: Math.floor(Date.now() / 1000)
		}
		const s = JSON.stringify(sample, null, 2)
		setInput(s)
		setOutput(s)
		setStatus({ valid: true, message: 'Valid JSON' })
	}

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-lg font-semibold text-white">JSON Formatter</h1>
					<p className="text-sm text-zinc-500 mt-0.5">Validate, format and minify JSON.</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<button onClick={loadSample} className="btn-ghost">Sample</button>
					<button onClick={() => { setInput(''); setOutput(''); setStatus(null) }} className="btn-ghost">Clear</button>
					<button onClick={() => format(2)} className="btn-primary">Prettify</button>
					<button onClick={() => format(0)} className="btn-ghost">Minify</button>
					<button onClick={sortKeys} className="btn-ghost">Sort Keys</button>
					<button onClick={() => copyToClipboard(output)} className="btn-ghost">Copy</button>
				</div>
			</div>

			{/* Status */}
			{status && (
				<div className={`text-xs font-mono px-3 py-2 rounded-lg border ${
					status.valid
						? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
						: 'bg-rose-500/8 border-rose-500/20 text-rose-400'
				}`}>
					{status.valid ? '✓' : '✗'} {status.message}
				</div>
			)}

			{/* Editors */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<label className="text-xs text-zinc-500">Input</label>
					<textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder={'{\n  "key": "value"\n}'}
						rows={20}
						className="editor-area"
					/>
				</div>
				<div className="space-y-1.5">
					<label className="text-xs text-zinc-500">Output</label>
					<textarea
						value={output}
						readOnly
						rows={20}
						placeholder="Formatted output appears here…"
						className="editor-area text-emerald-300/80"
					/>
				</div>
			</div>
		</div>
	)
}
