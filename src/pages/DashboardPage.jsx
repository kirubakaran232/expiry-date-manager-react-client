import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, deleteProduct } from '../services/api';
import ToastContainer, { useToast } from '../components/Toast';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getDaysUntilExpiry = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / 86400000);
};

const ExpiryBadge = ({ dateStr }) => {
    const days = getDaysUntilExpiry(dateStr);
    if (days < 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Expired
            </span>
        );
    }
    if (days === 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Expires Today
            </span>
        );
    }
    if (days <= 7) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {days}d left
            </span>
        );
    }
    if (days <= 30) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {days}d left
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0984e3]/10 text-[#0984e3] border border-[#0984e3]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0984e3]" />
            {days}d left
        </span>
    );
};

const EXPIRY_FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
];

// ── Confirm Delete Modal ──────────────────────────────────────────────────────

const DeleteModal = ({ product, onConfirm, onCancel, loading }) => {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && !loading) onCancel(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [loading, onCancel]);

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const daysLeft = () => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const exp = new Date(product.expiryDate); exp.setHours(0, 0, 0, 0);
        return Math.round((exp - today) / 86400000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
                onClick={() => !loading && onCancel()}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-neutral-100 overflow-hidden">
                {/* Red top accent */}
                <div className="h-1 bg-gradient-to-r from-red-400 to-red-600" />

                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </div>

                    <h3 id="delete-modal-title" className="text-lg font-extrabold text-neutral-900 text-center mb-1">
                        Delete Product?
                    </h3>
                    <p className="text-sm text-neutral-500 text-center mb-5">
                        This action <span className="font-semibold text-neutral-700">cannot be undone</span>.
                    </p>

                    {/* Product preview card */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 mb-5">
                        <p className="font-semibold text-neutral-900 text-sm truncate">{product?.title}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                            {product?.upc && (
                                <span className="font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded-md">
                                    {product.upc}
                                </span>
                            )}
                            {product?.expiryDate && (
                                <span className="flex items-center gap-1">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <rect x="3" y="4" width="18" height="17" rx="2" />
                                        <path d="M8 2v4M16 2v4M3 9h18" />
                                    </svg>
                                    Expires {formatDate(product.expiryDate)}
                                    {daysLeft() < 0 && <span className="text-red-500 font-semibold ml-0.5">(Expired)</span>}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            id="delete-cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm
                                       hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            id="delete-confirm-btn"
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm
                                       transition-all duration-150 disabled:opacity-60
                                       flex items-center justify-center gap-2 shadow-md shadow-red-500/25"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                    Deleting…
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    </svg>
                                    Yes, Delete
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-xs text-neutral-400 mt-3">Press Esc to cancel</p>
                </div>
            </div>
        </div>
    );
};

// ── Dashboard Page ────────────────────────────────────────────────────────────

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const { toasts, showToast, dismissToast } = useToast();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expiryFilter, setExpiryFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const searchTimer = useRef(null);

    const fetchProducts = useCallback(async (opts = {}) => {
        setLoading(true);
        try {
            const data = await getProducts({
                search: opts.search ?? search,
                expiryFilter: opts.expiryFilter ?? expiryFilter,
                page: opts.page ?? page,
            });
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (err) {
            showToast({ message: err.message || 'Failed to load products', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [search, expiryFilter, page]);

    useEffect(() => {
        fetchProducts();
    }, [page, expiryFilter]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setPage(1);
            fetchProducts({ search: val, page: 1 });
        }, 400);
    };

    const handleFilterClick = (val) => {
        setExpiryFilter(val);
        setPage(1);
        fetchProducts({ expiryFilter: val, page: 1 });
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteProduct(deleteTarget._id);
            showToast({ message: `"${deleteTarget.title}" deleted successfully` });
            setDeleteTarget(null);
            fetchProducts();
        } catch (err) {
            showToast({ message: err.message || 'Failed to delete product', type: 'error' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0984e3] to-[#0773c5] flex items-center justify-center shadow-md shadow-[#0984e3]/25">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none" />
                                    <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M3 9h18" stroke="white" strokeWidth="2" />
                                    <circle cx="16" cy="16" r="4" fill="#e17055" />
                                    <path d="M14.5 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="font-bold text-neutral-900 text-base tracking-tight">ExpiryTrack</span>
                        </a>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <a
                                href="/products/add"
                                id="add-product-btn"
                                className="flex items-center gap-2 px-4 py-2 bg-[#e17055] hover:bg-[#c85a3e] text-white font-semibold text-sm rounded-xl shadow-md shadow-[#e17055]/25 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Product
                            </a>

                            {/* User menu */}
                            <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
                                <div className="w-8 h-8 rounded-full bg-[#0984e3]/10 flex items-center justify-center text-[#0984e3] font-bold text-sm">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-medium text-neutral-700 hidden sm:block">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    id="logout-btn"
                                    title="Logout"
                                    className="ml-1 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page title + stats */}
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-1">Dashboard</h1>
                    <p className="text-sm text-neutral-500">
                        {pagination.totalCount > 0
                            ? `${pagination.totalCount} product${pagination.totalCount !== 1 ? 's' : ''} tracked`
                            : 'No products yet'}
                    </p>
                </div>

                {/* Search + Filters bar */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 mb-6">
                    {/* Search */}
                    <div className="relative mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search by title or UPC code..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#0984e3]/25 focus:border-[#0984e3] transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); setPage(1); fetchProducts({ search: '', page: 1 }); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        )}
                    </div>

                    {/* Expiry filter chips */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-neutral-500 flex items-center mr-1">Expiry:</span>
                        {EXPIRY_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                id={`filter-${f.value}`}
                                onClick={() => handleFilterClick(f.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                    expiryFilter === f.value
                                        ? 'bg-[#0984e3] text-white shadow-sm shadow-[#0984e3]/30'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product table */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <svg className="animate-spin text-[#0984e3]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                            </svg>
                            <span className="text-sm text-neutral-400">Loading products…</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                    <path d="M16 3H8l-2 4h12l-2-4z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-neutral-800 mb-1">No products found</h3>
                            <p className="text-sm text-neutral-400 mb-5">
                                {search || expiryFilter !== 'all'
                                    ? 'Try adjusting your search or filters.'
                                    : 'Start tracking by adding your first product.'}
                            </p>
                            {!search && expiryFilter === 'all' && (
                                <a
                                    href="/products/add"
                                    className="px-5 py-2.5 bg-[#e17055] text-white font-semibold text-sm rounded-xl hover:bg-[#c85a3e] transition-colors"
                                >
                                    + Add First Product
                                </a>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Table header */}
                            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <span>Product</span>
                                <span>UPC</span>
                                <span>Qty</span>
                                <span>Expires</span>
                                <span className="text-right">Actions</span>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-neutral-100">
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-6 py-4 hover:bg-neutral-50/70 transition-colors group"
                                    >
                                        {/* Title + badge */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#0984e3]/8 flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0984e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                                    <path d="M16 3H8l-2 4h12l-2-4z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-neutral-900 text-sm">{product.title}</p>
                                                <div className="mt-0.5 md:hidden">
                                                    <ExpiryBadge dateStr={product.expiryDate} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* UPC */}
                                        <div className="flex items-center">
                                            <span className="text-sm text-neutral-500 font-mono">
                                                {product.upc || <span className="text-neutral-300">—</span>}
                                            </span>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex items-center">
                                            <span className="text-sm text-neutral-600">
                                                {product.amount != null ? product.amount : <span className="text-neutral-300">—</span>}
                                            </span>
                                        </div>

                                        {/* Expiry date + badge */}
                                        <div className="hidden md:flex flex-col gap-1">
                                            <span className="text-sm text-neutral-700 font-medium">{formatDate(product.expiryDate)}</span>
                                            <ExpiryBadge dateStr={product.expiryDate} />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 justify-end md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={`/products/${product._id}/edit`}
                                                id={`edit-btn-${product._id}`}
                                                className="p-2 rounded-lg text-neutral-400 hover:text-[#0984e3] hover:bg-[#0984e3]/8 transition-colors"
                                                title="Edit"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </a>
                                            <button
                                                onClick={() => setDeleteTarget(product)}
                                                id={`delete-btn-${product._id}`}
                                                className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" />
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
                                    <p className="text-xs text-neutral-500">
                                        Page <span className="font-semibold text-neutral-700">{pagination.currentPage}</span> of{' '}
                                        <span className="font-semibold text-neutral-700">{pagination.totalPages}</span>
                                        {' '}· {pagination.totalCount} total
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            id="prev-page-btn"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={pagination.currentPage === 1}
                                            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            ← Prev
                                        </button>
                                        <button
                                            id="next-page-btn"
                                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};

export default DashboardPage;
