const express = require("express");
const ProductManager = require("../ProductManager");
const CartManager = require("../CartManager");
const router = express.Router();
const path = require("path");
const cartsFilePath = path.join(__dirname, "../db/carts.json");
const cartManager = new CartManager(cartsFilePath);
const productsFilePath = path.join(__dirname, "../db/products.json");
const productManager = new ProductManager(productsFilePath);

router.post("/", async (req, res) => {
  const cart = await cartManager.addCart();
  res.json(cart);
});

router.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await cartManager.getCartById(cid);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const fullProducts = await Promise.all(
    cart.products.map(async (p) => {
      const product = await productManager.getProductById(p.product);
      return {
        ...product,
        quantity: p.quantity,
      };
    })
  );
  res.json(fullProducts);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const cart = await cartManager.addProductToCart(cid, pid);
  res.json(cart);
});

module.exports = router;
