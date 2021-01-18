const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../midleware/authMidleware");

//@description Fetch all products
//@rotes GET /api/products
router.get(
  "/",
  AsyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
//jebena ruta nije radila jer sam je stavio na kraju, a kad sam je stavio ovde radi
router.get(
  "/top",
  AsyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
  })
);

//@description Fetch product by id
//@rotes GET /api/products/:id
router.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

//@description Delete product
//@rotes DELETE /api/products/:id
//Admin
router.delete(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ mesage: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

//@description Create product
//@rotes Post /api/products
//Admin
router.post(
  "/",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "sample brand",
      category: "sample categ",
      countInStock: 0,
      numReviews: 0,
      description: "sample",
    });

    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
  })
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  AsyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

module.exports = router;
