const db = require('./../../models')
const geoGraphicalDistance = require('./../../services/geoGraphicalDistance')
const RazorPayDocs = require('./../../services/razorPay')
var logger = require('./../../services/logger')
const crypto = require('crypto');

const Razorpay = require('razorpay');
const { JSON } = require('sequelize');

var instance = new Razorpay({
    key_id: 'rzp_test_NEbxxMT8ZIGh3U',
    key_secret: 'NGqmSGE2qyMBqscS2UvdFK6W',
})
const webhookSecret = 'aaaaaa'
const Users = db.users
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.raw({ type: 'application/json' }));


module.exports = {
    // create plan and subscription
    createSubscriptionAndPlan: async (req, res) => {
        try {
            // Step 1: Create a Plan
            const planId = await RazorPayDocs.createPlan();
            // console.log(planId, '--------------------------- planId');
            console.log(JSON.parse(JSON.stringify(planId.id)), '--------------------------- planId');
            if (!planId) {
                return res.status(500).json({ success: false, message: error.message })
            }

            // Step 2: Create a Subscription using the Plan ID
            const subscription = await RazorPayDocs.createSubscription(planId.id);
            console.log(subscription, '--------------------------- subscription');

            return res.status(201).json({ success: true, message: "Subscription and plan generated successfully!", data: subscription })

        } catch (error) {
            logger.error(error.message);
            return res.status(500).json({ success: false, message: error.message })
        }
    },
    // create payment link
    createPaymentLink: async (req, res) => {
        try {
            const subscriptionOptions = {
                plan_id: "plan_PhnBAHZC10yLEa", // Your subscription plan ID
                total_count: 12, // Number of billing cycles (e.g., 12 months)
                customer_notify: 1, // Notify the customer via email/SMS
                // customer: {
                //     name: "kamal",
                //     email: "kamal@yopmail.com",
                //     contact: "+918160047249",
                // },
            };

            // Create the subscription
            const response = await instance.subscriptions.create(subscriptionOptions);
            // const response = await instance.paymentLink.create()

            console.log(response, '-------------------------- response');
            return res.status(201).json({ success: true, message: "payment link generated successfully!", data: response })

        } catch (error) {
            console.log(error)
            logger.error(error);
            return res.status(500).json({ success: false, message: "payment link not created successfully" })
        }
    },

    // handle post payment event
    webhook: async (req, res) => {
        try {
            console.log('-------------------------- event call');
            // const payload = req.body;
            // const payload = req.body
            const signature = req.headers['x-razorpay-signature'];
            console.log(signature, '------------------- signature');

            // console.log(payload.payment, '-------------------------- payment');
            // console.log(payload.order, '-------------------------- order');
            // console.log(payload.invoice, '-------------------------- invoice');

            // Convert payload to JSON string before passing to crypto.update()
            // const payloadString = JSON.stringify(payload);
            // console.log(payloadString, '-------------------------- payloadString');

            // Verify the webhook signature

            const payload = req.body;
            // Verify webhook signature
            // Verify the webhook signature
            // Verify signature
            const hmac = crypto.createHmac('sha256', webhookSecret);
            hmac.update(req.body); // req.body will now be a Buffer (raw body)
            const generatedSignature = hmac.digest('hex');
            console.log(generatedSignature, '------------------- generatedSignature');

            // if (signature !== generatedSignature) {
            //     console.error('Invalid webhook signature.');
            //     return res.status(400).json({ message: 'Invalid webhook signature.' });
            // }


            // console.log('Webhook received:', event);
            // console.log(payload, '-------------------------- event');
            if (payload.event === 'subscription.charged') {
                // const paymentId = payload.payment.entity
                // console.log(paymentId, '-------------------------- Payment received');
                console.log('-------------------------- Payment received');
                res.status(200).send('Payment received');
            } else {
                res.status(200).send('Event received');
            }

        } catch (error) {
            console.log(error)
            logger.error(error);
            return res.status(500).json({ success: false, message: "payment link not created successfully" })
        }
    },
    // add User
    createUser: async (req, res) => {
        try {
            const { name, email, password, latitude, longitude } = req.body
            var obj = {
                name: name,
                email: email,
                password: password,
                latitude: latitude,
                longitude: longitude
            }
            const user = await Users.create(obj)
            logger.info('user/add');
            return res.status(201).json({ success: true, message: "User created successfully", })

        } catch (error) {
            logger.error(error.message);
            return res.status(500).json({ success: false``, message: "User not created successfully" })
        }
    },
    // get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await Users.findAll()
            logger.info('user/get');
            return res.json({ success: true, data: users })
        } catch (error) {
            logger.error(error.message);
            return res.status(500).json({ success: false, message: "Failed to get users" })
        }
    },
    // get user distance
    getAll2KmNearUser: async (req, res) => {
        try {
            var myUser = await Users.findOne({ where: { id: 'c4a0ba18-601f-42ef-96ea-bd301e13bfc3' } })
            var myLat = myUser.latitude
            var myLong = myUser.longitude

            var nearUser = []

            const allUser = await Users.findAll()
            await allUser.map((item) => {
                var userDistance = {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance: geoGraphicalDistance.getDistanceFromLatLonInKm(myLat, myLong, item.latitude, item.longitude)
                }

                if (userDistance.distance <= 2) {
                    nearUser.push(item)
                }
            })
            logger.info('user/getnearuser');
            return res.status(200).json({ success: true, message: 'all user get successfully!', data: nearUser })

        } catch (error) {
            logger.error(error.message);
        }
    }


}