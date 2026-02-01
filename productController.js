const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name.trim(),
      price: req.body.price,
      description: req.body.description.trim(),
      category: req.body.category.trim(),
    });

    const savedProduct = await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: products.length,
      products: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    res.status(200).json({
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        price: req.body.price,
        description: req.body.description.trim(),
        category: req.body.category.trim(),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: product,
    });
  } catch (error) {
    next(error);
  }
};


