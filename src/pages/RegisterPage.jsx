import React, { useState } from 'react';
import { registerUser } from '../services/api';

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

const InputField = ({ id, label, type = 'text', placeholder, value, onChange, error, autoComplete, hint }) => {
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
            {hint && !error && (
                <p className="text-xs text-neutral-400">{hint}</p>
            )}
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

// ── Password strength meter ───────────────────────────────────────────────────

const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–5
};

const strengthConfig = [
    { label: '', color: 'bg-neutral-200' },
    { label: 'Very weak', color: 'bg-red-400' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-yellow-400' },
    { label: 'Good', color: 'bg-[#0984e3]' },
    { label: 'Strong', color: 'bg-green-500' },
];

const PasswordStrength = ({ password }) => {
    const score = getStrength(password);
    const cfg = strengthConfig[score];
    if (!password) return null;
    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? cfg.color : 'bg-neutral-200'}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${score <= 2 ? 'text-red-500' : score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                {cfg.label}
            </p>
        </div>
    );
};

// ── Register Page ─────────────────────────────────────────────────────────────

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
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
        if (!form.name.trim()) errors.name = 'Full name is required';
        else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

        if (!form.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address';

        if (!form.password) errors.password = 'Password is required';
        else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';

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
            await registerUser({
                name: form.name.trim(),
                email: form.email,
                password: form.password,
            });
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-[#e17055]/5 flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#0984e3]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e17055]/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-neutral-900/8 border border-neutral-100 p-8 sm:p-10">
                    <Logo />

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-1">
                            Create your account
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Start tracking expiry dates for free
                        </p>
                    </div>

                    {/* API Error banner */}
                    {apiError && (
                        <div
                            id="register-error-banner"
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
                            Account created! Redirecting to login...
                        </div>
                    )}

                    <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Name */}
                        <InputField
                            id="name"
                            label="Full name"
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            error={fieldErrors.name}
                            autoComplete="name"
                        />

                        {/* Email */}
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

                        {/* Password */}
                        <div>
                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                error={fieldErrors.password}
                                autoComplete="new-password"
                                hint="Use 6+ characters with a mix of letters, numbers & symbols"
                            />
                            <PasswordStrength password={form.password} />
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <a href="/terms" className="text-[#0984e3] hover:underline">Terms of Service</a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-[#0984e3] hover:underline">Privacy Policy</a>.
                        </p>

                        <button
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-3.5 px-6 bg-[#e17055] hover:bg-[#c85a3e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md shadow-[#e17055]/25 hover:shadow-[#e17055]/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create Free Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            id="register-login-link"
                            className="font-semibold text-[#0984e3] hover:text-[#0773c5] transition-colors"
                        >
                            Sign in
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

export default RegisterPage;
