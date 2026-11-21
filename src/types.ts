export type TabType = 'json' | 'jwt' | 'codec' | 'crypto' | 'uuid' | 'timestamp'

export interface Toast {
	id: number
	message: string
	type: 'success' | 'error' | 'info'
}

export interface ToolProps {
	showToast: (message: string, type?: 'success' | 'error' | 'info') => void
	copyToClipboard: (text: string, label?: string) => Promise<void>
}
