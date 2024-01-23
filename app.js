const express = require('express');
const ProductManager = require('./ProductManager');


const app = express();
const port = 3000;

const filePath = './productos.json';
const manager = new ProductManager(filePath);

app.get('/products', async (req, res) => {
  try {
    await manager.loadProducts();
    
    const limit = parseInt(req.query.limit, 10);
    let products = manager.getProducts();

    if (!isNaN(limit)) {
      products = products.slice(0, limit);
    }

    res.json({ products });
  } catch (error) {
    console.error('Error al encontrar productos:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    await manager.loadProducts();

    const productId = parseInt(req.params.pid, 10);
    const product = manager.getProductById(productId);

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
