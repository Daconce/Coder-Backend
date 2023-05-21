const express = require("express");
const ProductManager = require("../ProductManager");
const router = express.Router();
const path = require("path");
const productsFilePath = path.join(__dirname, "../db/products.json");
const productManager = new ProductManager(productsFilePath);

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit);
  let products = await productManager.getProducts();
  if (limit) {
    products = products.slice(0, limit);
  }

  res.json({ products });
});

router.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
});

router.post("/", async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await productManager.addProduct(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const updatedProduct = req.body;
  try {
    const product = await productManager.updateProduct(pid, updatedProduct);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    await productManager.deleteProduct(pid);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
