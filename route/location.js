const LocationControleur = require("../controleur/locationDB");
const Router = require("express-promise-router");
const router = new Router;
const JWTMiddleWare = require("../middleware/IdentificationJWT");


router.get('/:zipCode/:city', JWTMiddleWare.identification,LocationControleur.getLocation);
router.get('/', JWTMiddleWare.identification,LocationControleur.getAllLocation);
router.post('/', JWTMiddleWare.identification,LocationControleur.postLocation);
router.delete('/:zipCode/:city', JWTMiddleWare.identification,LocationControleur.deleteLocation);



module.exports = router;