const SubscriptionControler = require("../controleur/subscriptionDB");
const Router = require("express-promise-router");
const router = new Router();
const JWTMiddleWare = require("../middleware/IdentificationJWT");


// router.get(
//   "/:pseudoSubscriber/:pseudoSubscription",
//   SubscriptionControler.getSubscription
// );
router.get("/", JWTMiddleWare.identification,SubscriptionControler.getAllSubscription);
router.get(
  "/subscribers/:pseudoSubscription",
  JWTMiddleWare.identification,SubscriptionControler.getAllSubscribersByPseudo
);
router.get(
  "/subscriptions/:pseudoSubscriber",
  JWTMiddleWare.identification,SubscriptionControler.getAllSubscriptionsByPseudo
);
router.post("/", JWTMiddleWare.identification,SubscriptionControler.postSubscription);
router.delete("/:pseudoSubscriber/:pseudoSubscription", JWTMiddleWare.identification,SubscriptionControler.deleteSubscription);

module.exports = router;
