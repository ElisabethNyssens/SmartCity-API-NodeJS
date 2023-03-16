const pool = require("../modele/database");
const BookingModel = require("../modele/bookingDB");
const AdModel = require("../modele/adDB");
const UserModel = require("../modele/userDB");
const LocationModel = require("../modele/locationDB");

module.exports.getBooking = async (req, res) => {
  const client = await pool.connect();
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    try {
      if (isNaN(id)) {
        res.sendStatus(400);
      } else {
        const { rows: bookings } = await BookingModel.getBooking(id, client);
        const booking = bookings[0];
        if (booking !== undefined) {
          res.json(booking);
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
  }
};

module.exports.postBooking = async (req, res) => {
  const { date, state } = req.body;
  let { user } = req.body;
  const {
    pseudo,
    name,
    firstName,
    email,
    password,
    phone,
    streetName,
    streetNumber,
    zipCodeLocation,
    cityLocation,
  } = req.body;
  if (date === undefined || user === undefined) {
    res.sendStatus(400);
  } else {
    const client = await pool.connect();
    if (user === req.session.pseudo || req.session.authLevel === "manager") {
      try {
        await client.query("BEGIN;");
        if (!user && !(await UserModel.userExist(client, pseudo))) {
          if (!(await LocationModel.locationExist(zipCodeLocation, cityLocation, client))) {
            await LocationModel.postLocation(zipCodeLocation, cityLocation, client);
          }

          await UserModel.createUser(
            pseudo,
            name,
            firstName,
            email,
            password,
            phone,
            (nbpearls = 0),
            (helpcounter = 0),
            streetName,
            streetNumber,
            (isadmin = false),
            zipCodeLocation,
            cityLocation,
            client
          );
          user = pseudo;
        }
        
        if (req.session.authLevel === "manager") {
          const { rows: bookings } = await BookingModel.postBooking(
            date,
            state ?? "En attente d'approbation",
            user,
            client
          );
          res.status(201).json(bookings[0].id);
        } else {
          const { rows: bookings } = await BookingModel.postBooking(
            date,
            "En attente d'approbation",
            user,
            client
          );
          res.status(201).json(bookings[0].id);
        }

        await client.query("COMMIT");
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    } else {
      res.sendStatus(401);
    }
  }
};

module.exports.updateBooking = async (req, res) => {
  const { id, date, state, user } = req.body;
  const client = await pool.connect();
  if (date === undefined || user === undefined) {
    res.sendStatus(400);
  } else {
    try {
      const { rows } = await BookingModel.getBooking(id, client);
      if (rows[0] !== undefined) {
        if (rows[0].user === req.session.pseudo || req.session.authLevel === "manager") {
          if (req.session.authLevel === "manager") {
            await BookingModel.updateBooking(
              id,
              date,
              state ?? "En attente d'approbation",
              user,
              client
            );
          } else {
            await BookingModel.updateBooking(id, date, "En attente d'approbation", user, client);
          }
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
  }
};

module.exports.deleteBooking = async (req, res) => {
  const id = req.params.id;
  //+ parseInt
  if (isNaN(id)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    const client = await pool.connect();
    try {
      const { rows: bookings } = await BookingModel.getBooking(id, client);
      if (bookings[0] !== undefined) {
        const { rows: ads } = await AdModel.getAdFromBooking(client, id);
        if (
          req.session.authLevel === "manager" ||
          req.session.pseudo === bookings[0].user ||
          req.session.pseudo === ads[0].author
        ) {
          await BookingModel.deleteBooking(id, client);
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
  }
};

module.exports.getAllBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: bookings } = await BookingModel.getAllBooking(client);
    if (bookings !== undefined) {
      res.json(bookings);
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

module.exports.requestBooking = async (req, res) => {
  const { ad, user } = req.body;
  const adId = parseInt(ad);
  if (isNaN(adId)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    const client = await pool.connect();
    try {
      const { rows: ads } = await AdModel.getAd(adId, client);
      if (ads[0] === undefined) {
        res.sendStatus(404);
      } else {
        if (user === req.session.pseudo || req.session.authLevel === "manager") {
          if (ads[0].booking !== null) {
            res.status(409);
            res.json({ Error: "This booking is already requested" });
          } else if (user === ads[0].author) {
            res.status(400);
            res.json({ Error: "The author of the ad and the person who books must be different" });
          } else {
            await client.query("BEGIN;");
            const { rows: bookings } = await BookingModel.postBooking(
              undefined,
              "En attente d'approbation",
              user,
              client
            );
            const idBooking = bookings[0].id;
            AdModel.updateAd(
              client,
              adId,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              idBooking,
              undefined,
              undefined
            );
            await client.query("COMMIT");
            res.sendStatus(204);
          }
        } else {
          res.sendStatus(401);
        }
      }
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

module.exports.approveBooking = async (req, res) => {
  const { id } = req.body;
  if (isNaN(id)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    const client = await pool.connect();
    try {
      const { rows: bookings } = await BookingModel.getBooking(id, client);
      if (bookings === undefined) {
        res.sendStatus(404);
      } else {
        const { rows: ads } = await AdModel.getAdFromBooking(client, id);
        if (ads[0].author === req.session.pseudo || req.session.authLevel === "manager") {
          if (bookings[0].state === "En cours") {
            res.status(409);
            res.json({ Error: "This booking is already approved" });
          } else {
            await BookingModel.patchBooking(client, id, undefined, "En cours");
            res.sendStatus(204);
          }
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

module.exports.closeBooking = async (req, res) => {
  const id = parseInt(req.body.id);
  if (isNaN(id)) {
    res.status(400);
    res.json({ Error: "The given ID is not a number" });
  } else {
    const client = await pool.connect();
    try {
      const { rows: bookings } = await BookingModel.getBooking(id, client);
      if (bookings === undefined) {
        res.sendStatus(404);
      } else {
        const { rows: ads } = await AdModel.getAdFromBooking(client, id);
        if (ads[0] === undefined) {
          res.status(400);
          res.json({
            Error: "There is no ad linked to this reservation. Please contact an administrator",
          });
        } else {
          if (ads[0].author === req.session.pseudo || req.session.authLevel === "manager") {
            if (bookings[0].state === "Cloturé") {
              res.status(409);
              res.json({ Error: "This booking is already closed" });
            } else {
              await client.query("BEGIN;");
              await BookingModel.patchBooking(client, id, undefined, "Cloturé");
              const { rows: users } = await UserModel.getUser(bookings[0].user, client);
              const addPearls = users[0].nbpearls + 1;
              await UserModel.updateUser(
                client,
                bookings[0].user,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                addPearls,
                0
              );
              const { rows: authors } = await UserModel.getUser(ads[0].author, client);
              let helpCounter = authors[0].helpcounter + 1;
              let nbPearls = authors[0].nbpearls;
              if (helpCounter > 3) {
                nbPearls--;
                helpCounter = 0;
              }
              await UserModel.updateUser(
                client,
                ads[0].author,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                nbPearls,
                helpCounter
              );
              await client.query("COMMIT");
              res.sendStatus(204);
            }
          } else {
            res.sendStatus(401);
          }
        }
      }
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

module.exports.nbServicesReceived = async (req, res) => {
  const client = await pool.connect();
  const user = req.params.user;
  try {
    const count = await BookingModel.nbServicesReceived(user, client);
    res.json(count);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};

module.exports.nbServicesRendered = async (req, res) => {
  const client = await pool.connect();
  const user = req.params.user;
  try {
    const count = await BookingModel.nbServicesRendered(user, client);
    res.json(count);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};
