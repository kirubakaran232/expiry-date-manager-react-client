import { useState, useRef, useEffect, useCallback } from 'react';
import { createProduct } from '../services/api';
import ToastContainer, { useToast } from '../components/Toast';

// ── Barcode Scanner Modal (uses native BarcodeDetector Web API) ───────────────

const BarcodeScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);
    const detectorRef = useRef(null);

    const [phase, setPhase] = useState('init'); // init | active | error
    const [errorMsg, setErrorMsg] = useState('');
    const [lastDetected, setLastDetected] = useState('');

    const stopCamera = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const start = async () => {
            // 1. Check BarcodeDetector support
            if (!('BarcodeDetector' in window)) {
                setErrorMsg(
                    'Your browser does not support the BarcodeDetector API. ' +
                    'Please use Chrome or Edge on Android/desktop, or enter the UPC code manually.'
                );
                setPhase('error');
                return;
            }

            // 2. Request camera permission
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
                });
                if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch (err) {
                if (!mounted) return;
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setErrorMsg('Camera access was denied. Please allow camera access in your browser settings and try again.');
                } else if (err.name === 'NotFoundError') {
                    setErrorMsg('No camera found on this device. Please enter the UPC code manually.');
                } else {
                    setErrorMsg(`Camera error: ${err.message}`);
                }
                setPhase('error');
                return;
            }

            // 3. Create BarcodeDetector
            try {
                detectorRef.current = new BarcodeDetector({
                    formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'code_93', 'itf', 'qr_code'],
                });
            } catch {
                detectorRef.current = new BarcodeDetector(); // fallback: detect all
            }

            setPhase('active');

            // 4. Polling loop via rAF
            const detect = async () => {
                if (!mounted || !videoRef.current || videoRef.current.readyState < 2) {
                    rafRef.current = requestAnimationFrame(detect);
                    return;
                }
                try {
                    const barcodes = await detectorRef.current.detect(videoRef.current);
                    if (barcodes.length > 0 && mounted) {
                        const value = barcodes[0].rawValue;
                        setLastDetected(value);
                        stopCamera();
                        setTimeout(() => { if (mounted) onScan(value); }, 300);
                        return;
                    }
                } catch (_) { /* detection frame error — ignore */ }
                if (mounted) rafRef.current = requestAnimationFrame(detect);
            };
            rafRef.current = requestAnimationFrame(detect);
        };

        start();
        return () => {
            mounted = false;
            stopCamera();
        };
    }, [onScan, stopCamera]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-neutral-900 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0984e3]/20 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0984e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                                <rect x="7" y="7" width="3" height="10" rx="1" /><rect x="14" y="7" width="3" height="10" rx="1" />
                            </svg>
                        </div>
                        <span className="font-bold text-white text-sm">Scan Barcode</span>
                    </div>
                    <button
                        onClick={() => { stopCamera(); onClose(); }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Camera viewport */}
                <div className="relative bg-neutral-950" style={{ aspectRatio: '4/3' }}>
                    {/* Video feed — always mounted so stream can attach */}
                    <video
                        ref={videoRef}
                        className={`w-full h-full object-cover ${phase !== 'active' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Loading state */}
                    {phase === 'init' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <svg className="animate-spin text-[#0984e3]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                            </svg>
                            <span className="text-xs text-neutral-400">Starting camera…</span>
                        </div>
                    )}

                    {/* Error state */}
                    {phase === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed">{errorMsg}</p>
                        </div>
                    )}

                    {/* Scanning overlay */}
                    {phase === 'active' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950/40" />

                            {/* Scan frame */}
                            <div className="relative w-56 h-40">
                                {/* Corner brackets */}
                                <div className="absolute top-0 left-0 w-7 h-7 border-t-3 border-l-3 border-[#e17055] rounded-tl-lg" style={{ borderWidth: '3px 0 0 3px' }} />
                                <div className="absolute top-0 right-0 w-7 h-7 border-t-3 border-r-3 border-[#e17055] rounded-tr-lg" style={{ borderWidth: '3px 3px 0 0' }} />
                                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-3 border-l-3 border-[#e17055] rounded-bl-lg" style={{ borderWidth: '0 0 3px 3px' }} />
                                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-3 border-r-3 border-[#e17055] rounded-br-lg" style={{ borderWidth: '0 3px 3px 0' }} />

                                {/* Animated scan line */}
                                <div
                                    className="absolute left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#e17055] to-transparent"
                                    style={{ animation: 'scanLine 1.8s ease-in-out infinite' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Detected flash */}
                    {lastDetected && (
                        <div className="absolute inset-0 bg-green-400/20 flex items-center justify-center animate-pulse pointer-events-none">
                            <div className="bg-green-500 rounded-full p-4 shadow-xl shadow-green-500/40">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="bg-neutral-900 px-5 py-3.5 text-center">
                    <p className="text-xs text-neutral-500">
                        Hold barcode steady inside the frame • Supports UPC-A/E, EAN-8/13, Code128
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scanLine {
                    0%, 100% { top: 8%; opacity: 0.6; }
                    50% { top: 88%; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

// ── Input Field ───────────────────────────────────────────────────────────────

const Field = ({ id, label, required, children, error, hint }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-neutral-700 flex items-center gap-1">
            {label}
            {required
                ? <span className="text-red-400 ml-0.5">*</span>
                : <span className="text-neutral-400 font-normal text-xs">(optional)</span>
            }
        </label>
        {children}
        {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
        {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                {error}
            </p>
        )}
    </div>
);

const inputCls = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white outline-none
     transition-all duration-200 focus:ring-2 focus:ring-[#0984e3]/20 focus:border-[#0984e3]
     ${hasError ? 'border-red-400 bg-red-50/40' : 'border-neutral-200 hover:border-neutral-300'}`;

// ── Add Product Page ──────────────────────────────────────────────────────────

const AddProductPage = () => {
    const { toasts, showToast, dismissToast } = useToast();

    const [form, setForm] = useState({ title: '', upc: '', amount: '', expiryDate: '' });
    const [errors, setErrors] = useState({});
    const [showScanner, setShowScanner] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── Field change ──
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // ── Barcode scan callback ──
    const handleScan = useCallback((code) => {
        setForm((prev) => ({ ...prev, upc: code }));
        setShowScanner(false);
        showToast({ message: `Barcode captured: ${code}` });
    }, [showToast]);

    // ── Client-side validation matching backend validators ──
    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.expiryDate) errs.expiryDate = 'Expiry date is required';
        else {
            const d = new Date(form.expiryDate);
            if (isNaN(d.getTime())) errs.expiryDate = 'Expiry date must be a valid date';
        }
        if (form.amount !== '' && isNaN(Number(form.amount))) errs.amount = 'Amount must be a number';
        return errs;
    };

    // ── Submit ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            await createProduct({
                title: form.title.trim(),
                upc: form.upc.trim() || null,       // optional per API
                amount: form.amount !== '' ? Number(form.amount) : null, // optional per API
                expiryDate: form.expiryDate,          // ISO8601 date
            });
            setSubmitted(true);
            showToast({ message: 'Product added successfully!' });
            setTimeout(() => { window.location.href = '/dashboard'; }, 900);
        } catch (err) {
            showToast({ message: err.message || 'Failed to add product. Please try again.', type: 'error' });
            setSubmitting(false);
        }
    };

    const clearUpc = () => setForm((prev) => ({ ...prev, upc: '' }));

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* ── Header ── */}
            <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
                    <a
                        href="/dashboard"
                        className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                        title="Back to Dashboard"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </a>

                    <div className="flex items-center gap-2.5 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-[#e17055]/10 flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e17055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-extrabold text-neutral-900 leading-none tracking-tight">Add Product</h1>
                            <p className="text-xs text-neutral-400 mt-0.5">Track a new item's expiry date</p>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                        <span className="w-5 h-5 rounded-full bg-[#0984e3] text-white flex items-center justify-center text-xs font-bold">1</span>
                        Fill details
                        <span className="text-neutral-300">→</span>
                        <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center text-xs font-bold">2</span>
                        Save
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

                {/* ── UPC Scanner Card ── */}
                <div className="bg-gradient-to-br from-[#0984e3] to-[#0b5cae] rounded-2xl p-5 text-white shadow-lg shadow-[#0984e3]/20 relative overflow-hidden">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

                    <div className="relative flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                                <rect x="7" y="7" width="3" height="10" rx="1" />
                                <rect x="14" y="7" width="3" height="10" rx="1" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-base">Scan Product Barcode</p>
                            <p className="text-sm text-white/75 mt-0.5 leading-snug">
                                Point your camera at a UPC or EAN barcode to fill the code automatically.
                            </p>
                        </div>
                        <button
                            type="button"
                            id="open-scanner-btn"
                            onClick={() => setShowScanner(true)}
                            className="shrink-0 px-4 py-2.5 bg-white text-[#0984e3] font-bold text-sm rounded-xl shadow-md hover:bg-neutral-50 active:scale-95 transition-all duration-200"
                        >
                            Open Camera
                        </button>
                    </div>
                </div>

                {/* ── Form Card ── */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="px-6 py-5 border-b border-neutral-100">
                        <h2 className="text-sm font-bold text-neutral-800">Product Details</h2>
                        <p className="text-xs text-neutral-400 mt-0.5">Fields marked <span className="text-red-400">*</span> are required</p>
                    </div>

                    <form id="add-product-form" onSubmit={handleSubmit} noValidate className="p-6 space-y-5">

                        {/* Title */}
                        <Field id="title" label="Product Title" required error={errors.title}>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g. Whole Milk, Amoxicillin 500mg, Sunscreen SPF50"
                                value={form.title}
                                onChange={handleChange}
                                autoComplete="off"
                                autoFocus
                                className={inputCls(!!errors.title)}
                            />
                        </Field>

                        {/* UPC */}
                        <Field
                            id="upc"
                            label="UPC / Barcode Code"
                            error={errors.upc}
                            hint="Scan with camera or type the barcode number found on the packaging"
                        >
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        id="upc"
                                        name="upc"
                                        type="text"
                                        placeholder="012345678901"
                                        value={form.upc}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className={`${inputCls(!!errors.upc)} pr-8 font-mono tracking-wide`}
                                    />
                                    {form.upc && (
                                        <button
                                            type="button"
                                            onClick={clearUpc}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                                            title="Clear UPC"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    id="scan-barcode-btn"
                                    onClick={() => setShowScanner(true)}
                                    title="Scan barcode with camera"
                                    className="px-3.5 py-3 rounded-xl border border-neutral-200 text-neutral-400 hover:text-[#0984e3] hover:border-[#0984e3] hover:bg-[#0984e3]/5 transition-all duration-200 shrink-0"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                                        <rect x="7" y="7" width="3" height="10" rx="1" />
                                        <rect x="14" y="7" width="3" height="10" rx="1" />
                                    </svg>
                                </button>
                            </div>
                            {/* Scanned badge */}
                            {form.upc && !errors.upc && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">Barcode entered</span>
                                </div>
                            )}
                        </Field>

                        {/* Amount + Expiry Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                                id="amount"
                                label="Quantity / Amount"
                                error={errors.amount}
                                hint="Number of units or pieces"
                            >
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    placeholder="e.g. 1"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="0"
                                    step="any"
                                    className={inputCls(!!errors.amount)}
                                />
                            </Field>

                            <Field id="expiryDate" label="Expiry Date" required error={errors.expiryDate}>
                                <input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={handleChange}
                                    className={inputCls(!!errors.expiryDate)}
                                />
                            </Field>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                id="add-product-submit-btn"
                                type="submit"
                                disabled={submitting || submitted}
                                className="w-full py-4 bg-[#0984e3] hover:bg-[#0773c5] disabled:opacity-60 disabled:cursor-not-allowed
                                           text-white font-bold text-sm rounded-xl shadow-md shadow-[#0984e3]/25
                                           hover:shadow-[#0984e3]/40 transition-all duration-200
                                           hover:scale-[1.01] active:scale-[0.99]
                                           flex items-center justify-center gap-2.5"
                            >
                                {submitted ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Product Added!
                                    </>
                                ) : submitting ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                        </svg>
                                        Adding Product…
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add Product
                                    </>
                                )}
                            </button>

                            <a
                                href="/dashboard"
                                className="flex items-center justify-center mt-3 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                Cancel and go back
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Barcode Scanner Modal */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};

export default AddProductPage;

// Export ProductForm interface for EditProductPage reuse
export { inputCls, Field };
