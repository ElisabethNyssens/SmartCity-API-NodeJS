require("dotenv").config();
const process = require("process");
const jwt = require("jsonwebtoken");

const pool = require("../modele/database");
const typeUserModel = require("../modele/typeUserDB");



/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              pseudo:
 *                  type: string
 *              password:
 *                  type: string
 *                  format: password
 *          required:
 *              - pseudo
 *              - password
 */

module.exports.login = async (req, res) => {
  const { pseudo, password } = req.body;
  if (pseudo === undefined || password === undefined) {
    res.sendStatus(400);
  } else {
    const client = await pool.connect();
    try {
      const result = await typeUserModel.getUser(client, pseudo, password);
      const { userType, value } = result;

      if (userType === "inconnu") {
        res.status(404).json(value);
      } else {
        const { id, name, firstname } = value;
        const payload = {
          status: userType,
          value: { id, pseudo, name, firstname },
        };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
          expiresIn: "1d",
        });
        res.json({ accessToken: token, status: userType });
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};
