const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.lastProductId = 0;
  }

  saveToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  loadFromFile() {
    if (fs.existsSync(this.path)) {
      this.products = JSON.parse(fs.readFileSync(this.path));
      this.lastProductId = Math.max(...this.products.map((p) => p.id), 0);
    } else {
      this.products = [];
      this.lastProductId = 0;
    }
  }

  addProduct(product) {
    this.loadFromFile();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock ||
      !product.category ||
      !product.hasOwnProperty("status")
    ) {
      throw new Error("All product fields are required");
    }

    if (this.products.some((p) => p.code === product.code)) {
      throw new Error("Product code already exists");
    }

    const newProduct = {
      ...product,
      id: ++this.lastProductId,
      thumbnails: product.thumbnails || [],
      status: product.status === false ? false : true,
    };

    this.products.push(newProduct);
    this.saveToFile();
    return newProduct;
  }

  getProducts() {
    this.loadFromFile();
    return this.products;
  }

  getProductById(id) {
    this.loadFromFile();
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Not found");
    }
    return product;
  }

  updateProduct(id, updatedProduct) {
    this.loadFromFile();
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    const product = this.products[productIndex];

    const newProduct = {
      ...product,
      ...updatedProduct,
      id: product.id,
    };
    this.products[productIndex] = newProduct;
    this.saveToFile();
    return newProduct;
  }

  deleteProduct(id) {
    this.loadFromFile();
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(productIndex, 1);
    this.saveToFile();
  }
}

module.exports = ProductManager;
