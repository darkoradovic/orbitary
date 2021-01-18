const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../midleware/authMidleware");

//@description Create new order
//@rotes POST /api/orders
router.post(
  "/",
  protect,
  AsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
      return;
    } else {
      const order = new Order({
        orderItems: orderItems,
        user: req.user._id,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  })
);

//@description Get user order
//@rotes GET /api/orders/myorders
router.get(
  "/myorders",
  protect,
  AsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  })
);

//@description Get all orders
//@rotes GET /api/orders
router.get(
  "/",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  })
);

//@description Get order by ID
//@rotes GET /api/orders/:id
router.get(
  "/:id",
  protect,
  AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

//@description Update order to paid
//@rotes PUT /api/orders/:id/pay
router.put(
  "/:id/pay",
  protect,
  AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

//@description Update order to delivered
//@rotes PUT /api/orders/:id/deliver
router.put(
  "/:id/deliver",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

module.exports = router;
