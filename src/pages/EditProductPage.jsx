import { useState, useEffect } from 'react';
import { getProductById, updateProduct } from '../services/api';
import { inputCls, Field } from './AddProductPage';
import ToastContainer, { useToast } from '../components/Toast';

// ── Edit Product Page ─────────────────────────────────────────────────────────

const EditProductPage = () => {
    const { toasts, showToast, dismissToast } = useToast();

    // Extract :id from pathname /products/:id/edit
    const productId = window.location.pathname.split('/')[2];

    const [product, setProduct] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [form, setForm] = useState({ title: '', upc: '', amount: '', expiryDate: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── Fetch product by ID via GET /products/:id ──────────────────────────────
    useEffect(() => {
        const load = async () => {
            if (!productId) {
                setFetchError('Invalid product URL.');
                setFetching(false);
                return;
            }
            try {
                const data = await getProductById(productId);
                const p = data.product;
                setProduct(p);
                setForm({
                    title: p.title || '',
                    upc: p.upc || '',
                    amount: p.amount != null ? String(p.amount) : '',
                    expiryDate: p.expiryDate
                        ? new Date(p.expiryDate).toISOString().split('T')[0]
                        : '',
                });
            } catch (err) {
                setFetchError(err.message || 'Failed to load product.');
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [productId]);

    // ── Field change ──────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // ── Client-side validation mirroring backend rules ────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.expiryDate) errs.expiryDate = 'Expiry date is required';
        else if (isNaN(new Date(form.expiryDate).getTime()))
            errs.expiryDate = 'Expiry date must be a valid date';
        if (form.amount !== '' && isNaN(Number(form.amount)))
            errs.amount = 'Amount must be a number';
        return errs;
    };

    // ── Submit → PUT /products/:id ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            await updateProduct(productId, {
                title: form.title.trim(),
                upc: form.upc.trim() || null,
                amount: form.amount !== '' ? Number(form.amount) : null,
                expiryDate: form.expiryDate,
            });
            setSubmitted(true);
            showToast({ message: 'Product updated successfully!' });
            setTimeout(() => { window.location.href = '/dashboard'; }, 900);
        } catch (err) {
            showToast({ message: err.message || 'Failed to update product.', type: 'error' });
            setSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
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
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#0984e3]/10 flex items-center justify-center shrink-0">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0984e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-extrabold text-neutral-900 leading-none tracking-tight">
                                Edit Product
                            </h1>
                            {product && (
                                <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-xs">
                                    {product.title}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                {/* Loading state */}
                {fetching && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <svg className="animate-spin text-[#0984e3]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm text-neutral-400">Loading product…</span>
                    </div>
                )}

                {/* Error state */}
                {!fetching && fetchError && (
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-neutral-900 mb-2">{fetchError}</h2>
                        <p className="text-sm text-neutral-400 mb-5">
                            The product may have been deleted or you may not have permission to edit it.
                        </p>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0984e3] text-white font-semibold text-sm rounded-xl hover:bg-[#0773c5] transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </a>
                    </div>
                )}

                {/* Form */}
                {!fetching && !fetchError && product && (
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                        {/* Card header */}
                        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-neutral-800">Product Details</h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Fields marked <span className="text-red-400">*</span> are required
                                </p>
                            </div>
                            {/* Last updated chip */}
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Updated {new Date(product.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        <form id="edit-product-form" onSubmit={handleSubmit} noValidate className="p-6 space-y-5">

                            {/* Title */}
                            <Field id="title" label="Product Title" required error={errors.title}>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Whole Milk"
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
                                hint="Leave blank if not applicable"
                            >
                                <input
                                    id="upc"
                                    name="upc"
                                    type="text"
                                    placeholder="012345678901"
                                    value={form.upc}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className={`${inputCls(!!errors.upc)} font-mono tracking-wide`}
                                />
                            </Field>

                            {/* Amount + Expiry Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    id="amount"
                                    label="Quantity / Amount"
                                    error={errors.amount}
                                    hint="Number of units"
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

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    id="edit-product-submit-btn"
                                    type="submit"
                                    disabled={submitting || submitted}
                                    className="w-full py-4 bg-[#0984e3] hover:bg-[#0773c5]
                                               disabled:opacity-60 disabled:cursor-not-allowed
                                               text-white font-bold text-sm rounded-xl
                                               shadow-md shadow-[#0984e3]/25 hover:shadow-[#0984e3]/40
                                               transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                                               flex items-center justify-center gap-2.5"
                                >
                                    {submitted ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Changes Saved!
                                        </>
                                    ) : submitting ? (
                                        <>
                                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                            </svg>
                                            Saving Changes…
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17 21 17 13 7 13 7 21" />
                                                <polyline points="7 3 7 8 15 8" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <a
                                    href="/dashboard"
                                    className="flex items-center justify-center py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Cancel and go back
                                </a>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};

export default EditProductPage;
