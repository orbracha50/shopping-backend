import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getProducts, getProductById, addProduct, updateProduct, removeProduct } from './product.controller.js'

const router = express.Router()

router.get('/', log, getProducts)
router.get('/:id', log, getProductById)
router.post('/', log, requireAuth, addProduct)
router.put('/:id', requireAuth, updateProduct)
router.delete('/:id', requireAuth, removeProduct)

export const productRoutes = router