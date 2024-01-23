const express = require('express');
const app = express();
const fs = require('fs').promises;

class ProductManager {
  #id = 1;

  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const parsedData = JSON.parse(data);

      if (Array.isArray(parsedData)) {
        this.products = parsedData;
        const lastProduct = this.products[this.products.length - 1];
        this.#id = lastProduct ? lastProduct.id + 1 : 1;
      } else {
        this.products = [];
      }
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    product.id = this.#id++;
    this.products.push(product);
    this.saveProducts();
  }

  async getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct, id };
      this.saveProducts();
    } else {
      console.error('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
    } else {
      console.error('Producto no encontrado');
    }
  }
}

const filePath = 'productos.json';
const manager = new ProductManager(filePath);

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await manager.getProducts();

    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const producto = await manager.getProductById(productId);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
