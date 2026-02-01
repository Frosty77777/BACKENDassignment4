// Validation middleware for Product
const validateProduct = (req, res, next) => {
  const { name, price, description, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a positive number');
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};

// Validation middleware for Review
const validateReview = (req, res, next) => {
  const { productId, reviewerName, rating, comment } = req.body;
  const errors = [];

  if (!productId) {
    errors.push('Product ID is required');
  }
  if (!reviewerName || typeof reviewerName !== 'string' || reviewerName.trim().length === 0) {
    errors.push('Reviewer name is required and must be a non-empty string');
  }
  if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
    errors.push('Rating is required and must be a number between 1 and 5');
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    errors.push('Comment is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};

// Validation middleware for User registration
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.match(/^\S+@\S+\.\S+$/)) {
    errors.push('Valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};

// Validation middleware for User login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateReview,
  validateRegister,
  validateLogin,
};


