import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export const productService = {
	remove,
	query,
	getById,
	add,
	update,
}

async function query() {
	try {
		const collection = await dbService.getCollection('product')
        var productCursor = collection.find()

		const products = productCursor.toArray()
		return products
	} catch (err) {
		logger.error('cannot find products', err)
		throw err
	}
}

async function getById(productId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(productId)}

		const collection = await dbService.getCollection('product')
		const product = await collection.findOne(criteria)
        
		return product
	} catch (err) {
		logger.error(`while finding product ${productId}`, err)
		throw err
	}
}

async function remove(productId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerId} = loggedinUser

	try {
        const criteria = { _id: ObjectId.createFromHexString(productId)}
		criteria['createdBy._id'] = ownerId
        
		const collection = await dbService.getCollection('product')
		const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw('Not your product')
		return productId
	} catch (err) {
		logger.error(`cannot remove product ${productId}`, err)
		throw err
	}
}

async function add(product) {
	try {
		const collection = await dbService.getCollection('product')
		await collection.insertOne(product)

		return product
	} catch (err) {
		logger.error('cannot insert product', err)
		throw err
	}
}

async function update(product) {
    const productToSave = { imgUrl: product.imgUrl, title: product.title, songs: product.songs, description: product.description, name: product.name }
    try {
        const criteria = { _id: ObjectId.createFromHexString(product._id)}
		
		const collection = await dbService.getCollection('product')
		await collection.updateOne(criteria, { $set: productToSave })

		return product
	} catch (err) {
		logger.error(`cannot update product ${product._id}`, err)
		throw err
	}
}
