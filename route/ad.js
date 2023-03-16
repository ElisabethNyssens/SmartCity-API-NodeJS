const multer = require("multer"); // upload d'images
const Router = require("express-promise-router");
const JWTMiddleWare = require("../middleware/IdentificationJWT");

const AdControleur = require("../controleur/adDB");

const router = new Router;

/**
 * @swagger
 *
 * /ad/{id}:
 *  get:
 *      tags:
 *          - Ad
 *      parameters:
 *          - name: id
 *            description: ID d'une annonce
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/AdFound'
 *          400:
 *              description: L'id n'est pas un nombre
 *          404:
 *              description: Annonce non trouvée
 *          500:
 *              description: Erreur serveur
 *
 */

router.get("/:id", JWTMiddleWare.identification, AdControleur.getAd);
router.get(
  "/search/:search",
  JWTMiddleWare.identification,
  AdControleur.searchAllAdByTitle
);
router.get(
  "/city/:city",
  JWTMiddleWare.identification,
  AdControleur.getAllAdByCity
);

router.get(
  "/current/for/:user",
  JWTMiddleWare.identification,
  AdControleur.getAllCurrentAdsForUser
);
router.get(
  "/current/from/:user",
  JWTMiddleWare.identification,
  AdControleur.getAllCurrentAdsFromUser
);

router.get("/", JWTMiddleWare.identification, AdControleur.getAllAd);
router.get(
  "/author/:author",
  JWTMiddleWare.identification,
  AdControleur.getAllAdByPseudo
);

/**
 * @swagger
 * /ad:
 *  post:
 *      tags:
 *          - Ad
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AdToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/AdAdd'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: Utilisateur non trouvée
 *          500:
 *              description: Erreur serveur
 *
 */
router.post("/", JWTMiddleWare.identification, AdControleur.postAd);
/**
 * @swagger
 * /ad:
 *  patch:
 *      tags:
 *          - Ad
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AdToUpdate'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/AdUpdated'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 *
 */


router.patch("/", JWTMiddleWare.identification, AdControleur.updateAd);

/**
 *@swagger
 *components:
 *  responses:
 *    AdDeleted:
 *      description: l'annonce a été supprimée
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *            $ref: '#/components/schemas/AdToDeleteBadRequestResponse'
 *
 *  schemas:
 *    AdToDeleteBadRequestResponse:
 *      type: object
 *      oneOf:
 *        - $ref: '#/components/responses/ErrorJWT'
 *        - $ref: '#/components/responses/DeleteAdBadRequest'
 */


/**
 * @swagger
 *
 * /ad/{id}:
 *  delete :
 *      tags:
 *          - Ad
 *      security:
 *          - bearerAuth: []
 *      description: Supprime une annonce
 *      parameters:
 *        - name: id
 *          description: ID d'une annonce
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/AdDeleted'
 *          400:
 *              $ref: '#/components/responses/DeleteAdBadRequest'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: L'annonce n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */




router.delete("/:id", JWTMiddleWare.identification, AdControleur.deleteAd);

module.exports = router;
