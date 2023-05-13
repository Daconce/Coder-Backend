const express = require("express");
const ProductManager = require("./ProductManager");
const app = express();
const productManager = new ProductManager("../Data/products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  let products = await productManager.getProducts();

  if (limit) {
    products = products.slice(0, limit);
  }

  res.json({ products });
});

app.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(Number(pid));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
