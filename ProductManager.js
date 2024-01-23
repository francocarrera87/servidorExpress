const fs = require('fs');
const path = require('path');

class ProductManager {
  #id = 1;

  constructor(filePath) {
    this.path = filePath;
    this.eventos = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      const parsedData = JSON.parse(data);

      if (Array.isArray(parsedData)) {
        this.eventos = parsedData;
        const lastProduct = this.eventos[this.eventos.length - 1];
        this.#id = lastProduct ? lastProduct.id + 1 : 1;
      } else {
        this.eventos = [];
      }
      console.log('Productos cargados correctamente.');
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
      this.eventos = [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.eventos, null, 2), 'utf-8');
      console.log('Productos guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar productos:', error.message);
    }
  }

  getProducts() {
    return this.eventos;
  }

  addProduct(product) {
    // Verificar campos obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    // Verificar duplicados por código
    if (this.eventos.some(existingProduct => existingProduct.code === product.code)) {
      console.error('Ya existe un producto con el mismo código.');
      return;
    }

    product.id = this.#id++;
    this.eventos.push(product);
    this.saveProducts();
  }

  getProductById(id) {
    return this.eventos.find(product => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const index = this.eventos.findIndex(product => product.id === id);
    if (index !== -1) {
      this.eventos[index] = { ...this.eventos[index], ...updatedProduct, id };
      this.saveProducts();
    } else {
      console.error('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const index = this.eventos.findIndex(product => product.id === id);
    if (index !== -1) {
      this.eventos.splice(index, 1);
      this.saveProducts();
      console.log(`Producto con ID ${id} eliminado correctamente.`);
    } else {
      console.error(`No se encontró un producto con el ID ${id}.`);
    }
  }
}

// Utilizar ruta relativa al archivo
const filePath = './productos.json';
const manager = new ProductManager(filePath);

manager.addProduct({
  title: 'Libro4',
  description: 'Aventura',
  price: 50,
  thumbnail: 'imagen4',
  code: 'code4',
  stock: 8,
});

manager.addProduct({
  title: 'Libro5',
  description: 'Misterio',
  price: 30,
  thumbnail: 'imagen5',
  code: 'code5',
  stock: 15,
});

// Cambiar valores de un producto por ID
manager.updateProduct(25, { price: 2500, stock: 543 });
// Buscar un producto por ID
console.log(manager.getProductById(25));

// Eliminar un producto por ID
manager.deleteProduct(25);
module.exports = ProductManager;

