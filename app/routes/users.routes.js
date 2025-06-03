const express = require('express')
const controller = require('./../controller/users/users.controller')
const bodyParser = require('body-parser');
const app = express()
const router = express.Router()
//  
router.post('/user/webhook', controller.webhook)
router.post('/user/plan', controller.createSubscriptionAndPlan)
router.post('/user/payment', controller.createPaymentLink)
router.post('/user/add', controller.createUser)
router.get('/user/get', controller.getAllUsers)
router.get('/user/getnearuser', controller.getAll2KmNearUser)

module.exports = router