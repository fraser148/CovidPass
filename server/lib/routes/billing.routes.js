"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const billing_controller_1 = __importDefault(require("../controllers/billing.controller"));
const BillingRoutes = (app) => {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.post("/billing/payments", billing_controller_1.default.createPaymentIntent);
    app.post("/billing/wallet", billing_controller_1.default.createSetupIntent);
    app.get("/billing/wallet", billing_controller_1.default.listPaymentMethods);
    app.post("/billing/checkouts/", billing_controller_1.default.createStripeCheckoutSession);
    app.get("/billing/subscriptions/", billing_controller_1.default.listSubscriptions);
    app.post("/billing/subscriptions/", billing_controller_1.default.createSubscription);
    app.patch("/billing/subscriptions/:id", billing_controller_1.default.cancelSubscription);
};
exports.default = BillingRoutes;
//# sourceMappingURL=billing.routes.js.map