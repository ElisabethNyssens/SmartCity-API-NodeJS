module.exports.getReview = async (id, client) => {
  return await client.query("SELECT * FROM review WHERE id = $1", [id]);
};

module.exports.getAllReview = async (client) => {
  return await client.query("SELECT * FROM review ");
};

module.exports.postReview = async (score, comment, date, booking, author, recipient, client) => {
  return await client.query(
    "INSERT INTO review(score, comment, date, booking, author, recipient) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [score, comment, date, booking, author, recipient]
  );
};

module.exports.updateReview = async (
  id,
  score,
  comment,
  date = new Date().toISOString(),
  booking,
  author,
  recipient,
  client
) => {
  return await client.query(
    `
       UPDATE review SET score = $1, comment = $2, date = $3, booking = $4, author = $5, recipient = $6
       WHERE id = $7
  `,
    [score, comment, date, booking, author, recipient, id]
  );
};

//Faire un patch. Voir le patch fait sur un utilisateur pour exemple.
module.exports.patchReview = async (
  id,
  score,
  comment,
  date = new Date().toISOString(),
  booking,
  author,
  recipient,
  client
) => {
  const params = [];
  const querySet = [];
  let query = 'UPDATE "user" SET ';
  if (score !== undefined) {
    params.push(score);
    querySet.push(` score = $${params.length} `);
  }
  if (comment !== undefined) {
    params.push(comment);
    querySet.push(` comment = $${params.length} `);
  }
  if (date !== undefined) {
    params.push(date);
    querySet.push(` date = $${params.length} `);
  }
  if (booking !== undefined) {
    params.push(booking);
    querySet.push(` booking = $${params.length} `);
  }
  if (author !== undefined) {
    params.push(author);
    querySet.push(` author = $${params.length} `);
  }
  if (recipient !== undefined) {
    params.push(recipient);
    querySet.push(` recipient = $${params.length} `);
  }

  query += querySet.join(",");
  params.push(id);
  query += `WHERE (id = $${params.length})`;

  return await client.query(query, params);
};

module.exports.deleteReview = async (id, client) => {
  return await client.query("DELETE FROM review WHERE id = $1", [id]);
};

module.exports.reviewExist = async (booking, author, client) => {
  const { rows } = await client.query(
    "SELECT count(id) AS nbr FROM review WHERE booking = $1 AND author = $2",
    [booking, author]
  );
  return rows[0].nbr > 0;
};

module.exports.getAllReviewByUser = async (user, client) => {
  return await client.query(`SELECT * FROM review WHERE recipient = $1`, [user]);
};
