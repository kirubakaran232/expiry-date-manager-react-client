const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Makes an authenticated API request.
 * @param {string} endpoint - API endpoint (e.g. '/auth/login')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} - Parsed JSON response
 */
const request = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // sends httpOnly cookies
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        // Surface the first validation error or the message
        const message =
            data?.errors?.[0]?.msg ||
            data?.message ||
            'Something went wrong. Please try again.';
        throw new Error(message);
    }

    return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} payload
 */
export const registerUser = (payload) =>
    request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

/**
 * Login a user. On success the server sets an httpOnly JWT cookie.
 * @param {{ email: string, password: string }} payload
 */
export const loginUser = (payload) =>
    request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

/**
 * Verify the current session cookie and return the user.
 * Returns null if the cookie is missing or expired.
 */
export const getMe = () => request('/auth/me');

/**
 * Logout — instructs the server to clear the httpOnly cookie.
 */
export const logoutUser = () =>
    request('/auth/logout', { method: 'POST' });

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Get paginated, filtered products for the authenticated user.
 * @param {{ search?: string, expiryFilter?: string, page?: number }} params
 */
export const getProducts = ({ search = '', expiryFilter = 'all', page = 1 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (expiryFilter && expiryFilter !== 'all') params.set('expiryFilter', expiryFilter);
    params.set('page', String(page));
    return request(`/products?${params.toString()}`);
};

/**
 * Get a single product by ID.
 * @param {string} id - Product ID
 */
export const getProductById = (id) => request(`/products/${id}`);

/**
 * Create a new product.
 * @param {{ title: string, upc?: string, amount?: number, expiryDate: string }} payload
 */
export const createProduct = (payload) =>
    request('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

/**
 * Update an existing product.
 * @param {string} id - Product ID
 * @param {{ title: string, upc?: string, amount?: number, expiryDate: string }} payload
 */
export const updateProduct = (id, payload) =>
    request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });

/**
 * Delete a product by ID.
 * @param {string} id - Product ID
 */
export const deleteProduct = (id) =>
    request(`/products/${id}`, { method: 'DELETE' });
