const BookingControler = require("../controleur/bookingDB");
const Router = require("express-promise-router");
const { updateBooking } = require("../modele/bookingDB");
const JWTMiddleWare = require("../middleware/IdentificationJWT");

const router = new Router;

router.get("/:id", JWTMiddleWare.identification, BookingControler.getBooking);
router.get("/", JWTMiddleWare.identification, BookingControler.getAllBooking);
router.get(
  "/completed/for/:user",
  JWTMiddleWare.identification,
  BookingControler.nbServicesReceived
);
router.get(
  "/completed/by/:user",
  JWTMiddleWare.identification,
  BookingControler.nbServicesRendered
);
router.post("/", JWTMiddleWare.identification, BookingControler.postBooking);
router.put("/", JWTMiddleWare.identification, BookingControler.updateBooking);
router.post(
  "/request",
  JWTMiddleWare.identification,
  BookingControler.requestBooking
);
router.patch(
  "/approve",
  JWTMiddleWare.identification,
  BookingControler.approveBooking
);
router.patch(
  "/close",
  JWTMiddleWare.identification,
  BookingControler.closeBooking
);
router.delete(
  "/:id",
  JWTMiddleWare.identification,
  BookingControler.deleteBooking
);

module.exports = router;
