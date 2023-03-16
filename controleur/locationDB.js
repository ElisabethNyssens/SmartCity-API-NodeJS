const pool = require("../modele/database");
const LocationModel = require("../modele/locationDB");
const UserModel = require("../modele/userDB");

module.exports.getLocation = async (req, res) => {
  const client = await pool.connect();
  const { zipCode, city } = req.params;
  if (zipCode === undefined || city === undefined) {
    res.status(400);
    res.json({Error: "ZipCode AND city must be defined"});
  } else {
    try {
      const { rows: locations } = await LocationModel.getLocation(
        zipCode,
        city,
        client
      );
      const location = locations[0];
      if (location !== undefined) {
        res.json(location);
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

module.exports.getAllLocation = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: locations } = await LocationModel.getAllLocation(client);
    if (locations !== undefined) {
      res.json(locations);
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

module.exports.postLocation = async (req, res) => {
  const { zipCode, city } = req.body;
  if (zipCode === undefined || city === undefined) {
    res.status(400);
    res.json({Error: "ZipCode AND city must be defined"});
  } else {
    const client = await pool.connect();
    try {
      if (await LocationModel.locationExist(zipCode, city, client)) {
        res.status(409);
        res.json({Error:"This combination of zipCode and City already exists"});
      } else {
        await LocationModel.postLocation(zipCode, city, client);
        res.sendStatus(201);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

module.exports.deleteLocation = async (req, res) => {
  const { zipCode, city } = req.params;
  const client = await pool.connect();
  try {
    if (await LocationModel.locationExist(zipCode, city, client)) {
      if (!(await UserModel.locationUsedByUser(client, zipCode, city))) {
        await LocationModel.deleteLocation(zipCode, city, client);
        res.sendStatus(204);
      } else {
        res.status(400);
        res.json({error:"location used by user"});
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
