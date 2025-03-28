import express from "express";
import { CartModel } from "../models/cart.model.js"

const router = express.Router();


// (GET) Obtener carrito con productos
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('products.product')

    if(!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado'});
    }

    res.json({ status: 'success', payload: cart });

  } catch (error) {
    res.status(500).json({ status:'error', message: 'Error al obtener el carrito', error : error.message })
  }
});

// (ELIMINAR) eliminar UN produycto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const {cid, pid} = req.params;
    const cart = await CartModel.findById(cid);
    if(!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado"});
    }

    // filtrar productos dejando fuera el prodyucto eliminado
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();
    res.json({ status: 'success', message: `Producto de id: ${pid} eliminado del carrito ${cid}`});
    
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito', error: error.message });
  }
});

// (PUT) Actualizar carrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if(!Array.isArray(products)){
      return res.status(400).json({ status: 'error', message: 'El cuerpo debe contener un array de productos'});
    }

    const cart = await CartModel.findById(cid);
    if(!cart){
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado'});
    }
    cart.products = products;
    await cart.save();
    
    res.json({ status:'success', message: 'Carrito actualizado con exito', payload: cart });

  } catch (error) {
    res.status(500).json({ status:'error', message: 'Error al actualziar el carrito', error: error.message });
  }
});

// (PUT) Actualizza o modifica cantidad de producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if(typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un numero mayout o igual a 1'});
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado '});
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Productoi no encontrado en el carrito'});
    }

    cart.products[productIndex].quantity = quantity ;
    await cart.save();

    res.json({ status: 'success', message: `Se actualizo el producto de id ${pid} a la cantidad de ${quantity}`, error: error.message });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al acutlizar la cantidad', error:error.message});
  }
});

// (DELETE) vaciar todo el carrido
router.delete('/:cid', async (req, res) => {
  try {
    const { cid }= req.params

    const cart = await CartModel.findById(cid);
    if(!cart) {
      return res.status(404).json({
        status: 'error', message: 'Carrito no encontrado'
      });
    }

    cart.products = [];
    await cart.save();

    res.json({ status:'success', message: `Carrito de id: ${cid} vaciado con exito`});

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito', error: error.message})
  }
});

// (POST) Agregar un producto al carrito o incrementar cantidad
router.post('/:cid/products/:pid', async (req, res) => {
  // console.log("POST recibido en /api/carts/:cid/products/:pid");

  try {
    const { cid, pid } = req.params;
    const { quantity = 1} = req.body;

    const cart = await CartModel.findById(cid);
    if(!cart) {
      return res.status(404).json({ status: 'error', message: "Carrito no encontrado"});
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if(productInCart) {
      productInCart.quantity += Number(quantity);
    } else {
      cart.products.push({ product: pid, quantity: Number(quantity) });
    }

    await cart.save();

    res.redirect(`/carts/${cid}`);

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito', error: error.message});
  }
});

export default router