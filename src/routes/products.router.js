import express from 'express';
import { ProductModel } from '../models/Product.js';

const router = express.Router();

// GET /api/products

router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    // Preparar filtro condicional
    const filters = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filters.status = query === 'true';
      } else {
        filters.category = query;
      }
    }

    // Definir ordenamiento
    let sortOptions = {};
    if (sort === 'asc') sortOptions.price = 1;
    else if (sort === 'desc') sortOptions.price = -1;

    // Ejecutar paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      lean: true, // mejora el rendimiento (devuelve objetos JS simples)
    };

    const result = await ProductModel.paginate(filters, options);

    // Armar links de navegación
    const buildLink = (p) =>
      `/api/products?limit=${limit}&page=${p}` +
      (query ? `&query=${query}` : '') +
      (sort ? `&sort=${sort}` : '');

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos',
      error: error.message
    });
  }
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

      // const cartId = '' //Aqui poner id de prueba

      res.render('products', {
        products: result.docs, 
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
        // cartId
      });

  } catch (error) {
    res.status(500).send('Error al cargar los productos')
  }
})



export default router;