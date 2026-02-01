const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Public routes - GET operations
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes - Admin only for POST, PUT, DELETE
router.post('/', authenticate, authorizeAdmin, validateProduct, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, validateProduct, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

module.exports = router;
