module.exports.getBooking = async (id, client) => {
  return await client.query("SELECT * FROM booking WHERE id = $1", [id]);
};

module.exports.getAllBooking = async (client) => {
  return await client.query("SELECT * FROM booking");
};

module.exports.postBooking = async (date = new Date().toISOString(), state, user, client) => {
  return await client.query(
    'INSERT INTO booking(date, state, "user") VALUES ($1, $2, $3) RETURNING id',
    [date, state, user]
  );
};

module.exports.updateBooking = async (id, date = new Date().toISOString(), state, user, client) => {
  return await client.query(`UPDATE booking SET date = $1, state = $2, "user" = $3 WHERE id = $4`, [
    date,
    state,
    user,
    id,
  ]);
};

module.exports.patchBooking = async (client, id, date, state, user) => {
  const params = [];
  const querySet = [];
  let query = "UPDATE booking SET ";
  if (date !== undefined) {
    params.push(date);
    querySet.push(` date = $${params.length} `);
  }
  if (state !== undefined) {
    params.push(state);
    querySet.push(` state = $${params.length} `);
  }
  if (user !== undefined) {
    params.push(user);
    querySet.push(` "user" = $${params.length} `);
  }

  query += querySet.join(",");
  params.push(id);
  query += `WHERE (id = $${params.length})`;
  return await client.query(query, params);
};

module.exports.deleteBooking = async (id, client) => {
  return await client.query("DELETE FROM booking WHERE id = $1", [id]);
};

module.exports.bookingExist = async (id, client) => {
  const { rows } = await client.query("SELECT count(id) AS nbr FROM booking WHERE id = $1", [id]);
  return rows[0].nbr > 0;
};

module.exports.nbServicesReceived = async (user, client) => {
  const { rows } = await client.query(
    `select COUNT(id) AS nbr FROM ad WHERE author = $1 AND booking IN (SELECT id from booking WHERE state = 'Cloturé')`,
    [user]
  );
  return rows[0].nbr;
};

module.exports.nbServicesRendered = async (user, client) => {
  const { rows } = await client.query(
    `select COUNT(id) AS nbr FROM booking WHERE state = 'Cloturé' AND "user" = $1`,
    [user]
  );
  return rows[0].nbr;
};
