import { Router } from "express";
import ProductManager from '../productManager.js'
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.get('/', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('home', { products });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('realTimeProducts', { products });
});

// (GETBYID) vista de  producto por id
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean();
    
    if(!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // const cartId = // usar el mismo id de pruebaa

    res.render('productDetail', { product, cartId });

  } catch (error) {
    res.status(500).send("Error al cargarr el producto");
  }
});


// (GETBYID) vista de  cart por id
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid)
    .populate('products.product')
    .lean();

    if(!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const productsWithSubtotal = cart.products.map(item => {
      const subtotal = item.product.price * item.quantity;
      return { ...item, subtotal};
    });
    
    const total = productsWithSubtotal.reduce((acc, item) => acc + item.subtotal, 0);
    
    res.writableNeedDrain('cartDetail', { products: productsWithSubtotal, total, cartId: cid});

  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
})

export default router