const UserControler = require("../controleur/userDB");
const JWTMiddleWare = require("../middleware/IdentificationJWT");

const Router = require("express-promise-router");
const router = new Router;



/**
 * @swagger
 *
 * /user/{pseudo}:
 *  get:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie un utilisateur
 *      parameters:
 *        - name: pseudo
 *          description: pseudo d'un utilisteur
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserFound'
 *          400:
 *              $ref: '#/components/responses/UserRetrievedBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé
 *          500:
 *              description: Erreur serveur
 */

router.get('/:pseudo', JWTMiddleWare.identification,UserControler.getUser);

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToGetBadRequest:
 *       description: Mauvaise requête pour la récupération d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToGetBadRequestResponse'
 *
 *   schemas:
 *     UserToGetBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/UserRetrievedBadRequest'
 */

/**
 * @swagger
 *
 * /user:
 *  get:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      description: Renvoie tous les utilisateurs
 *      responses:
 *          200:
 *              $ref: '#/components/responses/AllUserFound'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: Aucun utilisateur n'a pas été trouvé
 *          500:
 *              description: Erreur serveur
 */

router.get('/', JWTMiddleWare.identification,UserControler.getAllUser);
router.get('/search/:search', JWTMiddleWare.identification,UserControler.searchAllUser);

/**
 * @swagger
 *
 * /user:
 *  post:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      description: Ajoute un utilisateur
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/UserAdded'
 *          400:
 *              $ref: '#/components/responses/AddUserBadRequest'
 *          500:
 *              description: Erreur serveur
 */

router.post('/', UserControler.inscriptionUser);


/**
 * @swagger
 *
 * /user:
 *  patch:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      description: Modifie un utilisateur
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          400:
 *              $ref: '#/components/responses/UpdateUserBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */
router.patch('/', JWTMiddleWare.identification, UserControler.patchUser);


/**
 * @swagger
 *
 * components:
 *   responses:
 *     UserToDeleteBadRequest:
 *       description: Mauvaise requête pour la suppression d'un utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/UserToDeleteBadRequestResponse'
 *
 *   schemas:
 *     UserToDeleteBadRequestResponse:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/ErrorJWT'
 *         - $ref: '#/components/responses/DeleteUserBadRequest'
 */

/**
 * @swagger
 *
 * /user/{id}:
 *  delete :
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      description: Supprime un utilisateur
 *      parameters:
 *        - name: id
 *          description: ID d'un utilisateur
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserDeleted'
 *          400:
 *              $ref: '#/components/responses/DeleteUserBadRequest'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: L'utilisateur n'a pas été trouvé dans la base de données
 *          500:
 *              description: Erreur serveur
 */

router.delete('/:pseudo', JWTMiddleWare.identification,UserControler.deleteUser);

module.exports = router;