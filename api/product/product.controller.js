import { logger } from '../../services/logger.service.js'
import { productService } from './product.service.js'

export async function getProducts(req, res) {
	try {
		const products = await productService.query()
		res.json(products)
	} catch (err) {
		logger.error('Failed to get products', err)
		res.status(400).send({ err: 'Failed to get products' })
	}
}

export async function getProductById(req, res) {
	try {
		const productId = req.params.id
		const product = await productService.getById(productId)
		res.json(product)
	} catch (err) {
		logger.error('Failed to get product', err)
		res.status(400).send({ err: 'Failed to get product' })
	}
}

export async function addProduct(req, res) {
	const { loggedinUser, body: product } = req

	try {
		product.createdBy = loggedinUser
		logger.info(product)
		const addedProduct = await productService.add(product)
		res.json(addedProduct)
	} catch (err) {
		logger.error('Failed to add product', err)
		res.status(400).send({ err: 'Failed to add product' })
	}
}

export async function updateProduct(req, res) {
	const { loggedinUser, body: product } = req
    const { _id: userId } = loggedinUser

    if(product.createdBy._id !== userId) {
        res.status(403).send('Not your product...')
        return
    }

	try {
		const product = req.body
		const updatedProduct = await productService.update(product)
		res.json(updatedProduct)
	} catch (err) {
		logger.error('Failed to update product', err)
		res.status(400).send({ err: 'Failed to update product' })
	}
}

export async function removeProduct(req, res) {
	try {
		const productId = req.params.id
		const removedId = await productService.remove(productId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove product', err)
		res.status(400).send({ err: 'Failed to remove product' })
	}
}

