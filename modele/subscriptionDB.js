// module.exports.getSubscription = async (
//   pseudoSubscriber,
//   pseudoSubscription,
//   client
// ) => {
//   return await client.query(
//     "SELECT * FROM subscription WHERE pseudoSubscriber = $1 AND pseudoSubscription = $2",
//     [pseudoSubscriber, pseudoSubscription]
//   );
// };

module.exports.getAllSubscription = async (client) => {
  return await client.query("SELECT * FROM subscription");
};

module.exports.getAllSubscriptionsByPseudo = async (
  pseudoSubscriber,
  client
) => {
  return await client.query(
    "SELECT pseudoSubscription FROM subscription WHERE pseudoSubscriber = $1",
    [pseudoSubscriber]
  );
};

module.exports.getAllSubscribersByPseudo = async (
  pseudoSubscription,
  client
) => {
  return await client.query(
    "SELECT pseudoSubscriber FROM subscription WHERE pseudoSubscription = $1",
    [pseudoSubscription]
  );
};

module.exports.postSubscription = async (
  pseudoSubscriber,
  pseudoSubscription,
  client
) => {
  return await client.query(
    "INSERT INTO subscription (pseudoSubscriber, pseudoSubscription) VALUES ($1, $2)",
    [pseudoSubscriber, pseudoSubscription]
  );
};

module.exports.updateSubscription = async (
  client,
  pseudoSubscriber,
  pseudoSubscription
) => {
  return await client.query(
    `
     UPDATE subscription SET pseudoSubscriber = $1 AND pseudoSubscription = $2
`,
    [pseudoSubscriber, pseudoSubscription]
  );
};

module.exports.deleteSubscription = async (
  pseudoSubscriber,
  pseudoSubscription,
  client
) => {
  return await client.query(
    "DELETE FROM subscription WHERE pseudoSubscriber = $1 AND pseudoSubscription = $2",
    [pseudoSubscriber, pseudoSubscription]
  );
};

module.exports.subscriptionExist = async (client, pseudoSubscriber, pseudoSubscription) => {
    const {rows} = await client.query('SELECT count(pseudoSubscriber) AS nbr FROM subscription WHERE pseudoSubscriber = $1 AND pseudoSubscription = $2', [pseudoSubscriber, pseudoSubscription]);
    return rows[0].nbr > 0;
}
