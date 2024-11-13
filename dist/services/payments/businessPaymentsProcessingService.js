"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = void 0;
const Transaction_1 = require("../../models/Transaction");
const TransactionHistory_1 = require("../../models/TransactionHistory");
const stripe_1 = __importDefault(require("stripe"));
const UserProfile_1 = require("../../models/UserProfile");
const User_1 = require("../../models/User");
const Card_1 = require("../../models/Card");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET, { apiVersion: '2024-10-28.acacia' });
const processPayment = (user_id, amount, transaction_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({
            where: { id: user_id }
        });
        if (!user) {
            return {
                status: 'failed',
                message: 'User does not exist.',
                data: null
            };
        }
        const userProfile = yield UserProfile_1.UserProfile.findOne({
            where: { username_id: user_id }
        });
        if (!userProfile) {
            return {
                status: 'failed',
                message: 'User profile does not exist.',
                data: null
            };
        }
        const card = yield Card_1.Card.findOne({
            where: { user_profile_id: userProfile.id, is_default: true },
        });
        if (!card) {
            return {
                status: 'failed',
                message: 'No default card found for the user.',
                data: null
            };
        }
        const paymentMethodId = card.stripe_payment_method_id;
        if (!paymentMethodId) {
            return {
                status: 'failed',
                message: 'No payment method found for the user.',
                data: null
            };
        }
        const paymentMethod = yield stripe.paymentMethods.retrieve(paymentMethodId);
        if (!paymentMethod) {
            return {
                status: 'failed',
                message: 'Payment method not found.',
                data: null
            };
        }
        let customer;
        const stripeCustomerId = userProfile.stripe_customer_id;
        if (stripeCustomerId) {
            customer = yield stripe.customers.retrieve(stripeCustomerId);
        }
        if (!customer) {
            customer = yield stripe.customers.create({
                email: user.email,
                name: `${user.first_name} ${user.lastname}`,
                description: 'Customer for POS transaction',
            });
            yield UserProfile_1.UserProfile.update({ stripe_customer_id: customer.id }, { where: { id: userProfile.id } });
        }
        const attachedPaymentMethods = yield stripe.customers.listPaymentMethods(customer.id, {
            type: 'card',
        });
        const isPaymentMethodAttached = attachedPaymentMethods.data.some(pm => pm.id === paymentMethod.id);
        if (!isPaymentMethodAttached) {
            if (paymentMethod.customer && paymentMethod.customer !== customer.id) {
                yield stripe.paymentMethods.detach(paymentMethod.id);
            }
            yield stripe.paymentMethods.attach(paymentMethod.id, {
                customer: customer.id,
            });
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            confirm: true,
            description: `Transaction for user ${user.first_name} ${user.lastname}`,
            payment_method: paymentMethod.id,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic',
                },
            },
            return_url: process.env.APP_URL
        });
        yield Transaction_1.Transaction.update({
            success: true,
            transaction_date: new Date()
        }, {
            where: { id: transaction_id }
        });
        yield TransactionHistory_1.TransactionHistory.create({
            transaction_id,
            user_id
        });
        return {
            status: 'success',
            message: 'Payment processed successfully',
            data: {
                transactionId: paymentIntent.id,
                transaction_id,
                user_id,
                amount
            }
        };
    }
    catch (error) {
        yield Transaction_1.Transaction.update({
            success: false,
            transaction_date: new Date()
        }, {
            where: { id: transaction_id }
        });
        yield TransactionHistory_1.TransactionHistory.create({
            transaction_id,
            user_id
        });
        return {
            status: 'failed',
            message: 'Failed to process payment: ' + error.message,
            data: null
        };
    }
});
exports.processPayment = processPayment;
