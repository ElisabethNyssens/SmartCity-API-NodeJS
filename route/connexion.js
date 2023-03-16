const Router = require("express-promise-router");
const router = new Router;
const userController = require('../controleur/connexionUserDB');

/**
 * @swagger
 * /connexion:
 *  post:
 *      tags:
 *          - User
 *      description: renvoie un JWT token permettant l'identification
 *      requestBody:
 *          description: login pour la connexion
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *            description: un token JWT
 *            content:
 *                text/plain:
 *                    schema:
 *                        type: string
 *          400:
 *            description: nom d'utilisateur ou mot de passe manquants
 *          401:
 *            description: mot de passe incorrect
 *          404:
 *            description: utilisateur inconnu
 *          500:
 *            description: erreur serveur
 *
 */
router.post('/', userController.login);

module.exports = router;