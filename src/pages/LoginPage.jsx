import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ── Shared UI pieces ──────────────────────────────────────────────────────────

const Logo = () => (
    <a href="/" className="flex items-center gap-3 group mb-8 justify-center">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0984e3] to-[#0773c5] flex items-center justify-center shadow-lg shadow-[#0984e3]/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none" />
                <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 9h18" stroke="white" strokeWidth="2" />
                <circle cx="16" cy="16" r="4" fill="#e17055" />
                <path d="M14.5 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-neutral-900 tracking-tight">ExpiryTrack</span>
            <span className="text-xs font-medium text-[#0984e3]">Date Manager</span>
        </div>
    </a>
);

const InputField = ({ id, label, type = 'text', placeholder, value, onChange, error, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold text-neutral-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={resolvedType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white outline-none transition-all duration-200
                        focus:ring-2 focus:ring-[#0984e3]/25 focus:border-[#0984e3]
                        ${error ? 'border-red-400 bg-red-50/30' : 'border-neutral-200 hover:border-neutral-300'}
                        ${isPassword ? 'pr-12' : ''}
                    `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

// ── Login Page ────────────────────────────────────────────────────────────────

const LoginPage = () => {
    const { saveUser } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        setApiError('');
    };

    const validate = () => {
        const errors = {};
        if (!form.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address';
        if (!form.password) errors.password = 'Password is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            const data = await loginUser({ email: form.email, password: form.password });
            saveUser(data.user);
            setSuccess(true);
            // Redirect after brief success flash
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-[#0984e3]/5 flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0984e3]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e17055]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-neutral-900/8 border border-neutral-100 p-8 sm:p-10">
                    <Logo />

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-1">
                            Welcome back
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Sign in to manage your expiry dates
                        </p>
                    </div>

                    {/* API Error banner */}
                    {apiError && (
                        <div
                            id="login-error-banner"
                            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            {apiError}
                        </div>
                    )}

                    {/* Success banner */}
                    {success && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            Login successful! Redirecting...
                        </div>
                    )}

                    <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                        <InputField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={fieldErrors.email}
                            autoComplete="email"
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            error={fieldErrors.password}
                            autoComplete="current-password"
                        />

                        <div className="flex items-center justify-end">
                            <a
                                href="/forgot-password"
                                className="text-xs font-medium text-[#0984e3] hover:text-[#0773c5] transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-3.5 px-6 bg-[#0984e3] hover:bg-[#0773c5] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md shadow-[#0984e3]/25 hover:shadow-[#0984e3]/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <a
                            href="/register"
                            id="login-register-link"
                            className="font-semibold text-[#e17055] hover:text-[#c85a3e] transition-colors"
                        >
                            Create one free
                        </a>
                    </p>
                </div>

                {/* Back to home */}
                <p className="text-center mt-6">
                    <a href="/" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to home
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
