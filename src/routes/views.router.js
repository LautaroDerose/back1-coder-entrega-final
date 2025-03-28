import { Router } from "express";
import ProductManager from '../productManager.js'
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

const DEFAULT_CART_ID = '67e6dd19386e5c76bb3c7f35';

router.get('/', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('home', { products });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('realTimeProducts', { products });
});

// (GET) para vista poaginada de productos
router.get('/products', async (req, res) => {
  try {
    const { page =1, limit = 10, sort, query } = req.query;

    const filters = {};
    if(query) {
      if (query === 'true' || query === 'false') {
        filters.status = query === 'true';
      } else {
        filters.category = query ;
      }
    }

    const sortOptions = {};
    if(sort === 'asc') sortOptions.price = 1;
    if(sort === 'desc') sortOptions.price = -1;

    const result = await ProductModel.paginate(filters, { page, limit, sort:sortOptions, lean: true});

    const buildLink = (p) => 
      `/products?limit=${limit}&page=${p}` + 
      (query ? `&query=${query}`: '') +
      (sort ? `&sort=${sort}` : '');

      const DEFAULT_CART_ID = '67e6dd19386e5c76bb3c7f35';

      res.render('products', {
        products: result.docs, 
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
        cartId: DEFAULT_CART_ID
      });

  } catch (error) {
    res.status(500).send('Error al cargar los productos')
  }
})

// (GETBYID) vista de  producto por id
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean();
    
    if(!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // const cartId = // usar el mismo id de pruebaa

    // res.render('productDetail', { product });
    res.render('productDetail', { product, cartId: DEFAULT_CART_ID });

  } catch (error) {
    console.error(error)
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
    
    res.render('cartDetail', { products: productsWithSubtotal, total, cartId: cid});

  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
})

export default router