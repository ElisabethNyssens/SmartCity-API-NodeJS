const pool = require("../modele/database");
const AdModel = require("../modele/adDB");
const LocationModel = require("../modele/locationDB");
const UserModel = require("../modele/userDB");

/**
 * @swagger
 * components:
 *   schemas:
 *       Ad:
 *           type: object
 *           properties:
 *               id:
 *                   type: integer
 *               title:
 *                   type: string
 *                   description: nom de l'annonce
 *               content:
 *                   type: string
 *               creationDate:
 *                   type: string
 *                   format: date
 *               streetName:
 *                   type: string
 *               streetNumber:
 *                   type: integer
 *               author:
 *                   type: integer
 *               serviceDate:
 *                   type: string
 *                   format: date
 *               availability:
 *                   type: string
 *               booking:
 *                   type: integer
 *               zipCodeLocation:
 *                   type: integer
 *               cityLocation:
 *                   type: string
 *
 */
/**
 * @swagger
 * components:
 *   responses:
 *       AdFound:
 *           description: Renvoie une annonce
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Ad'
 */

module.exports.getAd = async (req, res) => {
  const client = await pool.connect();
  const id = parseInt(req.params.id);
  try {
    if (isNaN(id)) {
      res.status(400);
      res.json({ Error: "The given ID is not a number" });
    } else {
      const { rows: ads } = await AdModel.getAd(id, client);
      const ad = ads[0];
      if (ad !== undefined) {
        res.json(ad);
      } else {
        res.sendStatus(404);
      }
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};

module.exports.getAllAd = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: ads } = await AdModel.getAllAd(client);
    if (ads !== undefined) {
      res.json(ads);
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
 *     AdUpdated:
 *         description: l'annonce a été mise à jour
 *  requestBodies:
 *     AdToUpdate:
 *       content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties:
 *                       id:
 *                           type: integer
 *                       title:
 *                           type: string
 *                           description: nom de l'annonce
 *                       content:
 *                           type: string
 *                       creationDate:
 *                           type: string
 *                           format: date
 *                       streetName:
 *                           type: string
 *                       streetNumber:
 *                           type: integer
 *                       author:
 *                           type: integer
 *                       serviceDate:
 *                           type: string
 *                           format: date
 *                       availability:
 *                           type: string
 *                       booking:
 *                           type: integer
 *                       zipCodeLocation:
 *                           type: integer
 *                       cityLocation:
 *                           type: string
 */


/**
 *@swagger
 *components:
 *  responses:
 *      AdUpdated:
 *          description: L'annonce a été vérifié
 *      VerifyEventBadRequest:
 *          description: Tous les champs du corps de la requête doivent être définis
 *  requestBodies:
 *      EventToVerify:
 *          description : L'évènement à vérifier
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          adminMessage:
 *                              type: string
 *                          isVerified:
 *                              type: boolean
 *                      required:
 *                          - adminMessage
 *                          - isVerified
 */

module.exports.updateAd = async (req, res) => {
  if (req.session) {
    const clientObj = req.session;
    const toUpdate = req.body;
    const newData = {};
    let doUpdate = false;
    {
      if (
        toUpdate.id !== undefined ||
        toUpdate.title !== undefined ||
        toUpdate.content !== undefined ||
        toUpdate.creationDate !== undefined ||
        toUpdate.streetName !== undefined ||
        toUpdate.streetNumber !== undefined ||
        toUpdate.author !== undefined ||
        toUpdate.serviceDate !== undefined ||
        toUpdate.availability !== undefined ||
        toUpdate.booking !== undefined ||
        toUpdate.zipCodeLocation !== undefined ||
        toUpdate.cityLocation !== undefined
      ) {
        doUpdate = true;
      }
      if (doUpdate) {
        newData.id = toUpdate.id;
        newData.title = toUpdate.title;
        newData.creationDate = toUpdate.creationDate;
        newData.streetName = toUpdate.streetName;
        newData.streetNumber = toUpdate.streetNumber;
        newData.author = toUpdate.author;
        newData.serviceDate = toUpdate.serviceDate;
        newData.availability = toUpdate.availability;
        newData.booking = toUpdate.booking;
        newData.zipCodeLocation = toUpdate.zipCodeLocation;
        newData.cityLocation = toUpdate.cityLocation;

        const client = await pool.connect();
        try {
          await client.query("BEGIN;");
          const { rows } = await AdModel.getAd(toUpdate.id, client);
          if (rows != undefined) {
            if (rows[0].author === req.session.pseudo || req.session.authLevel === "manager") {
              if (newData.zipCodeLocation && newData.cityLocation !== undefined) {
                const { rows: locations } = await LocationModel.getLocation(
                  newData.zipCodeLocation,
                  newData.cityLocation,
                  client
                );
                const location = locations[0];
                if (location === undefined) {
                  await LocationModel.postLocation(
                    newData.zipCodeLocation,
                    newData.cityLocation,
                    client
                  );
                }
              }

              await AdModel.updateAd(
                client,
                newData.id,
                newData.title,
                newData.content,
                newData.creationDate,
                newData.streetName,
                newData.streetNumber,
                newData.author,
                newData.serviceDate,
                newData.availability,
                newData.booking,
                newData.zipCodeLocation,
                newData.cityLocation
              );
              await client.query("COMMIT");
              res.sendStatus(204);
            } else {
              res.sendStatus(401);
            }
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
    }
  } else {
    res.sendStatus(401);
  }
};

/**
 *@swagger
 *components:
 *  responses:
 *      AdDeleted:
 *          description: L'annonce a été supprimée
 *      DeleteAdBadRequest:
 *          description: L'id de l'annonce doit être fourni
 *  requestBodies:
 *      AdToDelete:
 *          description : Annonce à supprimer
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              required:
 *                                -  id
 *
 */

module.exports.deleteAd = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    const client = await pool.connect();
    try {
      const { rows } = await AdModel.getAd(id, client);
      if (rows === undefined) {
        res.sendStatus(404);
      } else {
        if (rows[0].author === req.session.pseudo || req.session.authLevel === "manager") {
          await AdModel.deleteAd(id, client);
          res.sendStatus(204);
        } else {
          res.sendStatus(401);
        }
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

/**
 * @swagger
 * components:
 *   responses:
 *       AdAdd:
 *           description: L'annonce a été ajoutée
 *   requestBodies:
 *       AdToAdd:
 *           content:
 *               application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           id:
 *                               type: integer
 *                           title:
 *                               type: string
 *                               description: nom de l'annonce
 *                           content:
 *                               type: string
 *                           creationDate:
 *                               type: string
 *                               format: date
 *                           streetName:
 *                               type: string
 *                           streetNumber:
 *                               type: integer
 *                           author:
 *                               type: integer
 *                           serviceDate:
 *                               type: string
 *                               format: date
 *                           availability:
 *                               type: string
 *                           booking:
 *                               type: integer
 *                           zipCodeLocation:
 *                               type: integer
 *                           cityLocation:
 *                               type: string
 */

module.exports.postAd = async (req, res) => {
  const body = req.body;
  const {
    title,
    content,
    creationDate,
    author,
    serviceDate,
    availability,
    shouldUseAuthorAddress,
  } = body;
  let { booking, zipCodeLocation, cityLocation, streetName, streetNumber } = body;
  if (author === req.session.pseudo || req.session.authLevel === "manager") {
    const client = await pool.connect();
    if (
      title === undefined ||
      content === undefined ||
      creationDate === undefined ||
      author === undefined ||
      serviceDate === undefined ||
      availability === undefined ||
      (!shouldUseAuthorAddress &&
        (streetName === undefined ||
          streetNumber === undefined ||
          zipCodeLocation === undefined ||
          cityLocation === undefined))
    ) {
      return res.sendStatus(400);
    }
    if (!booking) {
      booking = null;
    }
    try {
      let location;
      if (shouldUseAuthorAddress) {
        const { rows: users } = await UserModel.getUser(author, client);
        if(users.length === 0){
          return res.sendStatus(404);
        }
        let user = users[0];
        zipCodeLocation = user.zipcodelocation;
        cityLocation =user.citylocation;
        streetName = user.streetname;
        streetNumber = user.streetnumber;
      } else {
        const { rows: locations } = await LocationModel.getLocation(
          zipCodeLocation,
          cityLocation,
          client
        );
        location = locations[0];
        if (location === undefined) {
          await LocationModel.postLocation(zipCodeLocation, cityLocation, client);
        }
      }
      await client.query("BEGIN;");
      const { rows: ads } = await AdModel.postAd(
        title,
        content,
        creationDate,
        streetName,
        streetNumber,
        author,
        serviceDate,
        availability,
        booking,
        zipCodeLocation,
        cityLocation,
        client
      );
      await client.query("COMMIT");
      res.status(201).json(ads[0].id);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  } else {
    res.sendStatus(403);
  }
};

module.exports.getAllAdByPseudo = async (req, res) => {
  const client = await pool.connect();
  const author = req.params.author;
  try {
    const { rows: ads } = await AdModel.getAllAdByPseudo(author, client);
    if (ads !== undefined) {
      res.json(ads);
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

module.exports.searchAllAdByTitle = async (req, res) => {
  const search = req.params.search;
  const client = await pool.connect();
  try {
    const { rows: ads } = await AdModel.searchAllAdByTitle(client, search);
    if (ads !== undefined) {
      res.json(ads);
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

module.exports.getAllAdByCity = async (req, res) => {
  const client = await pool.connect();
  const city = req.params.city;
  try {
    const { rows: ads } = await AdModel.getAllAdByCity(city, client);
    if (ads !== undefined) {
      res.json(ads);
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

module.exports.getAllCurrentAdsForUser = async (req, res) => {
  const client = await pool.connect();
  const user = req.params.user;
  try {
    const { rows: ads } = await AdModel.getAllCurrentAdsForUser(user, client);
    if (ads !== undefined) {
      res.json(ads);
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

module.exports.getAllCurrentAdsFromUser = async (req, res) => {
  const client = await pool.connect();
  const user = req.params.user;
  try {
    const { rows: ads } = await AdModel.getAllCurrentAdsFromUser(user, client);
    if (ads !== undefined) {
      res.json(ads);
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
