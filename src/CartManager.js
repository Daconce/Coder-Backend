const fs = require("fs");

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.lastCartId = 0;
  }

  saveToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts));
  }

  loadFromFile() {
    if (fs.existsSync(this.path)) {
      this.carts = JSON.parse(fs.readFileSync(this.path));
      this.lastCartId = Math.max(...this.carts.map((c) => c.id), 0);
    } else {
      this.carts = [];
      this.lastCartId = 0;
    }
  }

  addCart() {
    this.loadFromFile();
    const newCart = {
      id: ++this.lastCartId,
      products: [],
    };
    this.carts.push(newCart);
    this.saveToFile();
    return newCart;
  }

  getCartById(id) {
    this.loadFromFile();
    return this.carts.find((c) => c.id === id);
  }

  addProductToCart(cartId, productId, quantity = 1) {
    this.loadFromFile();
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const product = cart.products.find((p) => p.product === productId);
    if (product) {
      product.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
      });
    }
    this.saveToFile();
    return cart;
  }
}

module.exports = CartManager;
