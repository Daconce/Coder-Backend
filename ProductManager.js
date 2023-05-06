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
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      throw new Error("All product fields are required");
    }

    if (this.products.some((p) => p.code === product.code)) {
      throw new Error("Product code already exists");
    }

    const newProduct = {
      ...product,
      id: ++this.lastProductId,
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

// Test

// Se crea una instancia de la clase "ProductManager"
const productManager = new ProductManager("./products.json");

// Se llama al método "getProducts" recién creada la instancia, debe devolver un arreglo vacío []
console.log(productManager.getProducts()); // []

// Se llama al método "addProduct" con los campos del primer producto
const product1 = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
const newProduct1 = productManager.addProduct(product1);

// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
console.log(newProduct1);

// Se llama al método "getProducts" nuevamente, esta vez debe aparecer el producto recién agregado
console.log(productManager.getProducts());

// Se llama al método "getProductById" y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
try {
  console.log(productManager.getProductById(1));
  console.log(productManager.getProductById(100));
} catch (error) {
  console.error(error.message);
}

// Se llama al método "updateProduct" y se intentará cambiar un campo de algún producto
const updatedProduct = {
  title: "Producto actualizado",
  description: "Este es un producto actualizado",
  price: 300,
  thumbnail: "Nueva imagen",
  code: "def456",
  stock: 30,
};

try {
  const updatedProductResult = productManager.updateProduct(1, updatedProduct);
  console.log(updatedProductResult);
  console.log(productManager.getProducts());
} catch (error) {
  console.error(error.message);
}

// Se llama al método "deleteProduct", se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
try {
  productManager.deleteProduct(1);
  console.log(productManager.getProducts());
  productManager.deleteProduct(100);
} catch (error) {
  console.error(error.message);
}
