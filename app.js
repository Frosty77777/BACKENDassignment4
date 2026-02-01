const API_BASE_URL = '/api/products';

// DOM Elements
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const formMessage = document.getElementById('formMessage');
const refreshBtn = document.getElementById('refreshBtn');
const authBtn = document.getElementById('authBtn');
const authStatus = document.getElementById('authStatus');

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateAuthStatus();
});

// Form submission handler
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
    };

    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Product added successfully!', 'success');
            productForm.reset();
            loadProducts();
        } else {
            showMessage(data.error || 'Failed to add product', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Load all products
async function loadProducts() {
    loading.style.display = 'block';
    errorMessage.classList.remove('show');
    productsList.innerHTML = '';

    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (response.ok) {
            loading.style.display = 'none';
            
            if (data.products && data.products.length > 0) {
                displayProducts(data.products);
            } else {
                productsList.innerHTML = `
                    <div class="empty-state">
                        <h3>No products yet</h3>
                        <p>Add your first product using the form on the left!</p>
                    </div>
                `;
            }
        } else {
            throw new Error(data.error || 'Failed to load products');
        }
    } catch (error) {
        loading.style.display = 'none';
        errorMessage.textContent = 'Error loading products: ' + error.message;
        errorMessage.classList.add('show');
    }
}

// Display products in the grid
function displayProducts(products) {
    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <button class="btn btn-danger delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            <h3>${escapeHtml(product.name)}</h3>
            <span class="category">${escapeHtml(product.category)}</span>
            <div class="price">$${product.price.toFixed(2)}</div>
            <p class="description">${escapeHtml(product.description)}</p>
            <div class="meta">
                Created: ${formatDate(product.createdAt)}<br>
                Updated: ${formatDate(product.updatedAt)}
            </div>
        </div>
    `).join('');
}

// Delete a product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const headers = {};
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers,
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showMessage(data.error || 'Failed to delete product', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Refresh button handler
refreshBtn.addEventListener('click', () => {
    loadProducts();
});

// Show message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `message ${type}`;
    
    setTimeout(() => {
        formMessage.className = 'message';
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Authorization helpers ---
function getToken() {
    return localStorage.getItem('jwtToken');
}

function saveToken(token) {
    if (token) {
        localStorage.setItem('jwtToken', token);
    } else {
        localStorage.removeItem('jwtToken');
    }
    updateAuthStatus();
}

function clearToken() {
    localStorage.removeItem('jwtToken');
    updateAuthStatus();
}

function updateAuthStatus() {
    const t = getToken();
    if (!authStatus) return;
    authStatus.textContent = t ? 'Authorized' : 'Not authorized';
    if (authBtn) authBtn.textContent = t ? 'Change Token' : 'Authorize';
}

if (authBtn) {
    authBtn.addEventListener('click', () => {
        const current = getToken() || '';
        const token = prompt('Paste JWT token (leave empty to clear):', current);
        if (token === null) return; // cancelled
        if (token.trim() === '') {
            clearToken();
            showMessage('Token cleared', 'success');
        } else {
            saveToken(token.trim());
            showMessage('Token saved', 'success');
        }
    });
}



