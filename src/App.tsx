import { useState, useEffect } from 'react'
import phpspa from '@dconco/phpspa'
import type { TabType, Toast } from './types'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ToastContainer } from './components/ToastContainer'
import { JsonFormatter } from './pages/JsonFormatter'
import { JwtInspector } from './pages/JwtInspector'
import { CodecTool } from './pages/CodecTool'
import { CryptoTool } from './pages/CryptoTool'
import { UuidGenerator } from './pages/UuidGenerator'
import { TimestampConverter } from './pages/TimestampConverter'

function getPhpSpa(): any {
	if (typeof window === 'undefined') return null
	const w = window as any
	return w.phpspa || (phpspa as any)?.default || phpspa
}

function resolveTabFromPath(pathname: string): TabType {
	const clean = pathname.toLowerCase().replace(/\/$/, '')
	if (clean === '/jwt') return 'jwt'
	if (clean === '/codec' || clean === '/base64') return 'codec'
	if (clean === '/crypto' || clean === '/hash') return 'crypto'
	if (clean === '/uuid' || clean === '/tokens') return 'uuid'
	if (clean === '/timestamp' || clean === '/epoch' || clean === '/time') return 'timestamp'
	return 'json'
}

export default function App() {
	const [activeTab, setActiveTab] = useState<TabType>(() => {
		if (typeof window !== 'undefined') {
			const meta = document.getElementById('route-meta')?.getAttribute('data-route') as TabType | null
			if (meta && ['json', 'jwt', 'codec', 'crypto', 'uuid', 'timestamp'].includes(meta)) {
				return meta
			}
			return resolveTabFromPath(window.location.pathname)
		}
		return 'json'
	})

	const [toasts, setToasts] = useState<Toast[]>([])

	useEffect(() => {
		const syncRoute = () => {
			const currentTab = resolveTabFromPath(window.location.pathname)
			setActiveTab(currentTab)
		}

		window.addEventListener('popstate', syncRoute)

		const handleLoad = (payload?: { route?: string }) => {
			if (payload?.route) {
				try {
					const url = new URL(payload.route, window.location.origin)
					setActiveTab(resolveTabFromPath(url.pathname))
				} catch {
					syncRoute()
				}
			} else {
				syncRoute()
			}
		}

		const spa = getPhpSpa()
		if (spa && typeof spa.on === 'function') {
			try {
				spa.on('load', handleLoad)
			} catch (err) {
				console.warn('PhpSPA event registration:', err)
			}
		}

		return () => {
			window.removeEventListener('popstate', syncRoute)
			if (spa && typeof spa.off === 'function') {
				try {
					spa.off('load', handleLoad)
				} catch {}
			}
		}
	}, [])

	const handleSelectTab = (tab: TabType, path: string) => {
		setActiveTab(tab)
		if (window.location.pathname !== path) {
			const spa = getPhpSpa()
			if (spa && typeof spa.navigate === 'function') {
				try {
					spa.navigate(path, 'push')
					return
				} catch (err) {
					console.warn('PhpSPA navigate fallback:', err)
				}
			}
			window.history.pushState(null, '', path)
		}
	}

	const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
		const id = Date.now() + Math.random()
		setToasts(prev => [...prev, { id, message, type }])
		setTimeout(() => {
			setToasts(prev => prev.filter(t => t.id !== id))
		}, 2500)
	}

	const copyToClipboard = async (text: string, label = 'Copied to clipboard!') => {
		if (!text || text === '—') return
		try {
			await navigator.clipboard.writeText(text)
			showToast(label, 'success')
		} catch {
			showToast('Failed to copy', 'error')
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
			<ToastContainer toasts={toasts} />
			<Header activeTab={activeTab} onSelectTab={handleSelectTab} />

			<main className="max-w-6xl mx-auto px-5 py-8 w-full flex-1">
				{activeTab === 'json' && <JsonFormatter showToast={showToast} copyToClipboard={copyToClipboard} />}
				{activeTab === 'jwt' && <JwtInspector showToast={showToast} copyToClipboard={copyToClipboard} />}
				{activeTab === 'codec' && <CodecTool showToast={showToast} copyToClipboard={copyToClipboard} />}
				{activeTab === 'crypto' && <CryptoTool showToast={showToast} copyToClipboard={copyToClipboard} />}
				{activeTab === 'uuid' && <UuidGenerator showToast={showToast} copyToClipboard={copyToClipboard} />}
				{activeTab === 'timestamp' && <TimestampConverter showToast={showToast} copyToClipboard={copyToClipboard} />}
			</main>

			<Footer />
		</div>
	)
}
