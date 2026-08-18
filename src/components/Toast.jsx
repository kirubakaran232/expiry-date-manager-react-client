import { useState, useCallback } from 'react';

/**
 * useToast hook — returns { toasts, showToast, dismissToast }
 * showToast({ message, type: 'success' | 'error' })
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ message, type = 'success', duration = 3500 }) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, showToast, dismissToast };
};

/**
 * ToastContainer — render this once at the top of the page.
 */
const ToastContainer = ({ toasts, onDismiss }) => {
    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium animate-[slideUp_0.25s_ease] max-w-sm
                        ${toast.type === 'success'
                            ? 'bg-white border-green-200 text-green-800'
                            : 'bg-white border-red-200 text-red-700'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                    )}
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => onDismiss(toast.id)}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
