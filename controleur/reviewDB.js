const pool = require("../modele/database");
const ReviewModel = require("../modele/reviewDB");
const BookingModel = require("../modele/bookingDB");

module.exports.getReview = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400);
    res.json("The given ID is not a number");
  } else {
    const client = await pool.connect();
    try {
      if (isNaN(id)) {
        res.sendStatus(400);
      } else {
        const { rows: reviews } = await ReviewModel.getReview(id, client);
        const review = reviews[0];
        if (review !== undefined) {
          res.json(review);
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

module.exports.getAllReview = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: reviews } = await ReviewModel.getAllReview(client);
    if (reviews !== undefined) {
      res.json(reviews);
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

module.exports.postReview = async (req, res) => {
  const { score, comment, booking, author, recipient } = req.body;
  if (
    score === undefined ||
    comment === undefined ||
    booking === undefined ||
    author === undefined ||
    recipient === undefined
  ) {
    res.sendStatus(400);
  } else {
    const client = await pool.connect();
    try {
      if (await ReviewModel.reviewExist(booking, author, client)) {
        res.status(403).json("Already rated");
      } else {
        if (author === req.session.pseudo || req.session.authLevel === "manager") {
          const { rows: reviews } = await ReviewModel.postReview(
            score,
            comment,
            new Date(),
            booking,
            author,
            recipient,
            client
          );
          res.status(201).json(reviews[0].id);
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

module.exports.updateReview = async (req, res) => {
  const { id, score, comment, date, booking, author, recipient } = req.body;
  if (
    score === undefined ||
    comment === undefined ||
    date === undefined ||
    booking === undefined ||
    author === undefined ||
    recipient === undefined ||
    isNaN(parseInt(id))
  ) {
    res.sendStatus(400);
  } else {
    const client = await pool.connect();

    try {
      const { rows } = await ReviewModel.getReview(id, client);
      if (rows != undefined) {
        if (rows[0].user === req.session.pseudo || req.session.authLevel === "manager") {
          await ReviewModel.updateReview(
            id,
            score,
            comment,
            date,
            booking,
            author,
            recipient,
            client
          );
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

module.exports.deleteReview = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.sendStatus(400);
    res.json("The given ID is not a number");
  } else {
    const client = await pool.connect();
    try {
      const { rows } = await ReviewModel.getReview(id, client);
      if (rows[0].user === req.session.pseudo || req.session.authLevel === "manager") {
        await ReviewModel.deleteReview(id, client);
        res.sendStatus(204);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
};

module.exports.getAllReviewByUser = async (req, res) => {
  const client = await pool.connect();
  const user = req.params.user;
  try {
    const { rows: reviews } = await ReviewModel.getAllReviewByUser(user, client);
    if (reviews !== undefined) {
      res.json(reviews);
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
