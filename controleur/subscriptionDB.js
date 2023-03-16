const pool = require("../modele/database");
const SubscriptionModel = require("../modele/subscriptionDB");

module.exports.getAllSubscription = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: subscriptions } = await SubscriptionModel.getAllSubscription(
      client
    );
    if (subscriptions !== undefined) {
      res.json(subscriptions);
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

module.exports.getAllSubscriptionsByPseudo = async (req, res) => {
  const client = await pool.connect();
  const pseudoSubscriber = req.params.pseudoSubscriber;
  try {
    const { rows: subscriptions } =
      await SubscriptionModel.getAllSubscriptionsByPseudo(
        pseudoSubscriber,
        client
      );
    if (subscriptions !== undefined) {
      res.json(subscriptions);
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

module.exports.getAllSubscribersByPseudo = async (req, res) => {
  const client = await pool.connect();
  const pseudoSubscription = req.params.pseudoSubscription;
  try {
    const { rows: subscribers } =
      await SubscriptionModel.getAllSubscribersByPseudo(
        pseudoSubscription,
        client
      );
    if (subscribers !== undefined) {
      res.json(subscribers);
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

module.exports.postSubscription = async (req, res) => {
  const { pseudoSubscriber, pseudoSubscription } = req.body;
  if (pseudoSubscriber === undefined || pseudoSubscription === undefined) {
    res.status(400);
    res.json({Error:"pseudoSubscriber and pseudoSubcription must be defined"});
  }
  const client = await pool.connect();
  try {
    if (
      pseudoSubscriber === req.session.pseudo ||
      req.session.authLevel === "manager"
    ) {
      if (
        await SubscriptionModel.subscriptionExist(
          client,
          pseudoSubscriber,
          pseudoSubscription
        )
      ) {
        res.status(409);
        res.json(({Error:"This combination of pseudoSubscriber and pseudoSubcription already exists"}));
      } else {
        await SubscriptionModel.postSubscription(
          pseudoSubscriber,
          pseudoSubscription,
          client
        );
      }
      res.sendStatus(201);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
};

module.exports.deleteSubscription = async (req, res) => {
  const { pseudoSubscriber, pseudoSubscription } = req.params;
  const client = await pool.connect();
  try {
    if (
      await SubscriptionModel.subscriptionExist(
        client,
        pseudoSubscriber,
        pseudoSubscription
      )
    ) {
      if (
        pseudoSubscriber === req.session.pseudo ||
        req.session.authLevel === "manager"
      ) {
        await SubscriptionModel.subscriptionExist(
          client,
          pseudoSubscriber,
          pseudoSubscription
        );

        await SubscriptionModel.deleteSubscription(
          pseudoSubscriber,
          pseudoSubscription,
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
};
