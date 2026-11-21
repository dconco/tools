import type { Toast } from '../types'

interface ToastContainerProps {
	toasts: Toast[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
			{toasts.map(toast => (
				<div
					key={toast.id}
					className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-mono transition-all pointer-events-auto ${
						toast.type === 'success'
							? 'bg-zinc-900 border-emerald-500/50 text-emerald-200'
							: toast.type === 'error'
							? 'bg-zinc-900 border-rose-500/50 text-rose-200'
							: 'bg-zinc-900 border-zinc-700 text-zinc-200'
					}`}
				>
					{toast.type === 'success' && (
						<svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
						</svg>
					)}
					{toast.type === 'error' && (
						<svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					)}
					{toast.type === 'info' && (
						<svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					)}
					<span>{toast.message}</span>
				</div>
			))}
		</div>
	)
}
