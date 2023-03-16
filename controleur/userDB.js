const pool = require("../modele/database");
const UserDB = require("../modele/UserDB");
const UserConnexion = require("../controleur/connexionUserDB");
const LocationModel = require("../modele/locationDB");


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         pseudo:
 *           type: string
 *         name:
 *           type: string
 *         firstname:
 *           type : string
 *         email:
 *           type : string
 *         password:
 *           type: string
 *           format: password
 *         nbPearls:
 *           type: integer
 *         helpCounter:
 *           type: integer
 *         description:
 *           type : string
 *         streetName:
 *           type : string
 *         streetNumber:
 *           type : integer
 *         isAdmin:
 *           type: boolean
 *         zipCodeLocation:
 *           type: integer
 *         cityLocation:
 *           type: string

 */



/**
 *@swagger
 *components:
 *  responses:
 *      UserUpdated:
 *          description: L'utilisateur a été modifié
 *      UpdateUserBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      UserToUpdate:
 *          description : Utilisateur à mettre à jour
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          pseudo:
 *                              type: string
 *                          name:
 *                              type: string
 *                          firstname:
 *                              type : string
 *                          email:
 *                              type : string
 *                          password:
 *                              type: string
 *                              format: password
 *                          streetName:
 *                              type : string
 *                          streetNumber:
 *                              type : integer
 *                          zipCodeLocation:
 *                              type: integer
 *                          cityLocation:
 *                              type: string
 *                      required:
 *                          - pseudo
 *                          - name
 *                          - firstname
 *                          - email
 *                          - password
 *                          - streetName
 *                          - streetNumber
 *                          - zipCodeLocation
 *                          - cityLocation
 */

module.exports.patchUser = async (req, res) => {
  if (req.session) {
    const toUpdate = req.body;
    const newData = {};
    let doUpdate = false;
    if (toUpdate.pseudo === req.session.pseudo || req.session.authLevel === "manager") {
      if (
        toUpdate.pseudo !== undefined ||
        toUpdate.name !== undefined ||
        toUpdate.firstname !== undefined ||
        toUpdate.email !== undefined ||
        toUpdate.password !== undefined ||
        toUpdate.phone !== undefined ||
        toUpdate.nbPearls !== undefined ||
        toUpdate.helpCounter !== undefined ||
        toUpdate.description !== undefined ||
        toUpdate.streetName !== undefined ||
        toUpdate.streetNumber !== undefined ||
        toUpdate.isAdmin !== undefined ||
        toUpdate.zipCodeLocation !== undefined ||
        toUpdate.cityLocation !== undefined
      ) {
        doUpdate = true;
      }

      if (doUpdate) {
        newData.pseudo = toUpdate.pseudo;
        newData.name = toUpdate.name;
        newData.firstname = toUpdate.firstname;
        newData.email = toUpdate.email;
        newData.password = toUpdate.password;
        newData.phone = toUpdate.phone;
        newData.nbPearls = toUpdate.nbPearls;
        newData.helpCounter = toUpdate.helpCounter;
        newData.description = toUpdate.description;
        newData.streetName = toUpdate.streetName;
        newData.streetNumber = toUpdate.streetNumber;
        newData.isAdmin = toUpdate.isAdmin;
        newData.zipCodeLocation = toUpdate.zipCodeLocation;
        newData.cityLocation = toUpdate.cityLocation;

        const client = await pool.connect();
        try {
          if (await UserDB.userExist(client, toUpdate.pseudo)) {
            // if (newData.password === undefined) {
            //   const { rows: users } = await UserDB.getUser(toUpdate.pseudo, client);
            //   let user = users[0];
            //   newData.password = user.password;
            // }
            await client.query("BEGIN;");
            if (
              newData.zipCodeLocation &&
              newData.cityLocation &&
              !(await LocationModel.locationExist(
                newData.zipCodeLocation,
                newData.cityLocation,
                client
              ))
            ) {
              await LocationModel.postLocation(
                newData.zipCodeLocation,
                newData.cityLocation,
                client
              );
            }
            await UserDB.updateUser(
              client,
              newData.pseudo,
              newData.name,
              newData.firstname,
              newData.email,
              newData.password,
              newData.phone,
              newData.nbPearls,
              newData.helpCounter,
              newData.description,
              newData.streetName,
              newData.streetNumber,
              newData.isAdmin,
              newData.zipCodeLocation,
              newData.cityLocation
            );
            await client.query("COMMIT");
            res.sendStatus(204);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          await client.query("ROLLBACK");
          console.error(e);
          res.sendStatus(500);
        } finally {
          client.release();
        }
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};


/**
 *@swagger
 *components:
 *  responses:
 *      UserAdded:
 *          description: L'utilisateur a été ajouté
 *      AddUserBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      UserToAdd:
 *          description : Utilisateur à ajouter
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          pseudo:
 *                              type: string
 *                          name:
 *                              type: string
 *                          firstname:
 *                              type : string
 *                          email:
 *                              type : string
 *                          password:
 *                              type: string
 *                              format: password
 *                          streetName:
 *                              type : string
 *                          streetNumber:
 *                              type : integer
 *                          zipCodeLocation:
 *                              type: integer
 *                          cityLocation:
 *                              type: string
 *                      required:
 *                          - pseudo
 *                          - name
 *                          - firstname
 *                          - email
 *                          - password
 *                          - streetName
 *                          - streetNumber
 *                          - zipCodeLocation
 *                          - cityLocation
 */

module.exports.inscriptionUser = async (req, res) => {
  const {
    pseudo,
    name,
    firstname,
    email,
    password,
    phone,
    streetName,
    streetNumber,
    zipCodeLocation,
    cityLocation,
  } = req.body;
  if (
    pseudo === undefined ||
    name === undefined ||
    firstname === undefined ||
    email === undefined ||
    password === undefined ||
    phone === undefined ||
    streetName === undefined ||
    streetNumber === undefined ||
    zipCodeLocation === undefined ||
    cityLocation === undefined
  ) {
    res.sendStatus(400);
  } else {
    const client = await pool.connect();
    try {
      if (await UserDB.userExist(client, pseudo)) {
        res.status(409).json("Pseudo already used");
      } else if (await UserDB.emailExist(client, email)) {
        res.status(409).json("User whith this email already exists");
      } else {
        await client.query("BEGIN;");
        if (!(await LocationModel.locationExist(zipCodeLocation, cityLocation, client))) {
          await LocationModel.postLocation(zipCodeLocation, cityLocation, client);
        }

        await UserDB.createUser(
          pseudo,
          name,
          firstname,
          email,
          password,
          phone,
          (nbPearls = 0),
          (helpCounter = 0),
          streetName,
          streetNumber,
          (isAdmin = false),
          zipCodeLocation,
          cityLocation,
          client
        );
        await client.query("COMMIT");
        await UserConnexion.login(req, res);
      }
    } catch (e) {
      await client.query("ROLLBACK");
      console.error(e);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

/**
 *@swagger
 *components:
 *  responses:
 *      UserFound:
 *          description: Renvoie un utilisateur
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *      UserRetrievedBadRequest:
 *          description: Le pseudo de l'utilisateur doit être fournit
 */

module.exports.getUser = async (req, res) => {
  const client = await pool.connect();
  const pseudo = req.params.pseudo;
  try {
    const { rows: users } = await UserDB.getUser(pseudo, client);
    const user = users[0];
    if (user !== undefined) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};



/**
 *@swagger
 *components:
 *  responses:
 *      UserDeleted:
 *          description: L'utilisateur a été supprimée
 *      DeleteUserBadRequest:
 *          description: Le pseudo de l'utilisateur doit être définit
 */

module.exports.deleteUser = async (req, res) => {
  const pseudo = req.params.pseudo;
  const client = await pool.connect();
  try {
    if (await UserDB.userExist(client, pseudo)) {
      if (pseudo === req.session.pseudo || req.session.authLevel === "manager") {
        await UserDB.deleteUser(pseudo, client);
        res.sendStatus(204);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};


/**
 *@swagger
 *components:
 *  responses:
 *      AllUserFound:
 *          description: Renvoie tous les utilisateurs présents dans la base de donnée
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */

module.exports.getAllUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: users } = await UserDB.getAllUser(client);
    if (users !== undefined) {
      res.json(users);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};

module.exports.searchAllUser = async (req, res) => {
  const search = req.params.search;
  const client = await pool.connect();
  try {
    const { rows: users } = await UserDB.searchAllUser(client, search);
    if (users !== undefined) {
      res.json(users);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};
