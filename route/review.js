const ReviewControler = require("../controleur/reviewDB");
const Router = require("express-promise-router");
const JWTMiddleWare = require("../middleware/IdentificationJWT");

const { updateReview } = require("../modele/reviewDB");
const router = new Router;

router.get('/:id', JWTMiddleWare.identification,ReviewControler.getReview);
router.get('/', JWTMiddleWare.identification,ReviewControler.getAllReview);
router.get('/user/:user', JWTMiddleWare.identification,ReviewControler.getAllReviewByUser);

router.post('/', JWTMiddleWare.identification,ReviewControler.postReview);
router.put('/', JWTMiddleWare.identification,ReviewControler.updateReview);
router.delete('/:id', JWTMiddleWare.identification,ReviewControler.deleteReview);

module.exports = router;