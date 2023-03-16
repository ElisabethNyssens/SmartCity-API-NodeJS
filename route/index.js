const AdRouter = require('./ad');
const UserRouter = require('./user');
const LocationRouter = require('./location')
const ConnextionRouter = require('./connexion');
const BookingRouter = require('./booking');
const ReviewRouter = require('./review');
const SubscriptionRouter = require('./subscription');

const router = require("express").Router();

router.use("/ad", AdRouter);
router.use("/user", UserRouter);
router.use("/connexion", ConnextionRouter);
router.use("/location", LocationRouter);
router.use("/booking", BookingRouter);
router.use("/review", ReviewRouter);
router.use("/subscription", SubscriptionRouter);

module.exports = router;