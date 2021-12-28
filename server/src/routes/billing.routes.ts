import controller from '../controllers/billing.controller'

const BillingRoutes = (app) => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/billing/payments", controller.createPaymentIntent);
  app.post("/billing/wallet", controller.createSetupIntent);
  app.get("/billing/wallet", controller.listPaymentMethods);

  app.post("/billing/checkouts/", controller.createStripeCheckoutSession);

  app.get("/billing/subscriptions/", controller.listSubscriptions);
  app.post("/billing/subscriptions/", controller.createSubscription);
  app.patch("/billing/subscriptions/:id", controller.cancelSubscription);
};

export default BillingRoutes;