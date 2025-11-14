const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/product-controller.js')

router.post('/', controller.searchProducts)

module.exports = router
