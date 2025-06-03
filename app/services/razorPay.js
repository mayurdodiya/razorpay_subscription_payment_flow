const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_NEbxxMT8ZIGh3U',
    key_secret: 'NGqmSGE2qyMBqscS2UvdFK6W',
});

const createPlan = async () => {
    try {
        const planOptions = {
            period: 'monthly', // Billing cycle (daily, weekly, monthly, yearly)
            interval: 1, // Interval for the period
            item: {
                name: 'Monthly Subscription Plan',
                amount: 100, // Amount in paise (₹1 = 100 paise)
                currency: 'INR',
                description: '₹1 per month subscription plan',
            },
        };

        const plan = await instance.plans.create(planOptions);
        return plan; // Return Plan ID for creating subscriptions
    } catch (error) {
        console.error('Error creating plan:', error);
    }
}

const createSubscription = async (planId) => {
    try {
        const subscriptionOptions = {
            plan_id: planId, // Use the Plan ID created earlier
            total_count: 12, // Number of billing cycles (e.g., 12 months)
            customer_notify: 1, // Notify the customer via email
            start_at: Math.floor(Date.now() / 1000) + 60, // Start subscription 1 minute from now
            addons: [
                {
                    item: {
                        name: 'Registration Fee',
                        amount: 100, // Optional: One-time fee in paise (₹1)
                        currency: 'INR',
                    },
                },
            ],
        };

        const subscription = await instance.subscriptions.create(subscriptionOptions);
        console.log('Subscription created successfully:', subscription);
        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
    }
}



module.exports = { createPlan, createSubscription }

// {
//     id: 'sub_PhnBAx1dRvIIcR',
//     entity: 'subscription',
//     plan_id: 'plan_PhnBAHZC10yLEa',
//     status: 'created',
//     current_start: null,
//     current_end: null,
//     ended_at: null,
//     quantity: 1,
//     notes: [],
//     charge_at: 1736523442,
//     start_at: 1736523442,
//     end_at: 1765305000,
//     auth_attempts: 0,
//     total_count: 12,
//     paid_count: 0,
//     customer_notify: true,
//     created_at: 1736523382,
//     expire_by: null,
//     short_url: 'https://rzp.io/rzp/synqRE0a',
//     has_scheduled_changes: false,
//     change_scheduled_at: null,
//     source: 'api',
//     remaining_count: 12
//   } --------------------------- subscription