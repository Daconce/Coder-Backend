class ProductManager {
  constructor() {
    this.products = [];
    this.lastProductId = 0;
  }

  addProduct(product) {
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
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Not found");
    }
    return product;
  }
}

//Test

// Se crea una instancia de la clase "ProductManager"
const productManager = new ProductManager();

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
console.log(newProduct1); // { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25, id: 1 }

// Se llama al método "getProducts" nuevamente, esta vez debe aparecer el producto recién agregado
console.log(productManager.getProducts()); // [ { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25, id: 1 } ]

// Se llama al método "addProduct" con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
try {
  productManager.addProduct(product1);
} catch (error) {
  console.error(error.message); // "Product code already exists"
}

// Se evalúa que getProductById devuelva error si no encuentra el producto
console.log(productManager.getProductById(100)); // "Not found"

// Se evalúa que getProductById devuelva el producto en caso de encontrarlo
console.log(productManager.getProductById(1)); // { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25, id: 1 }
