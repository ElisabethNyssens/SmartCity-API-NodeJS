const { getHash } = require("../utils.js/utils");

module.exports.getUser = async (pseudo, client) => {
  return await client.query('SELECT * FROM "user" WHERE pseudo = $1', [pseudo]);
};

module.exports.getAllUser = async (client) => {
  return await client.query('SELECT * FROM "user"');
};

module.exports.createUser = async (
  pseudo,
  name,
  firstname,
  email,
  password,
  phone,
  nbPearls,
  helpCounter,
  streetName,
  streetNumber,
  isAdmin,
  zipCodeLocation,
  cityLocation,
  client
) => {
  return await client.query(
    'INSERT INTO "user"(pseudo, name, firstname, email, password, phone, nbPearls,helpCounter, streetName, streetNumber, isAdmin, zipCodeLocation, cityLocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [
      pseudo,
      name,
      firstname,
      email,
      await getHash(password),
      phone,
      nbPearls,
      helpCounter,
      streetName,
      streetNumber,
      isAdmin,
      zipCodeLocation,
      cityLocation,
    ]
  );
};

module.exports.updateUser = async (
  client,
  pseudo,
  name,
  firstname,
  email,
  password,
  phone,
  nbPearls,
  helpCounter,
  description,
  streetName,
  streetNumber,
  isAdmin,
  zipCodeLocation,
  cityLocation
) => {
  /*
 return await client.query(`
       UPDATE user SET name = $1, firstname = $2, email = $3, password = $4, nbPearls = $5, helpCounter = $6, picture = $7, description = $8, streetName = $9, streetNumber = $10, zipCodeLocation = $11, cityLocation = $12
       WHERE pseudo = $13
  `, [name, firstname, email, password, phone, nbPearls, helpCounter, picture, description, streetName, streetNumber, zipCodeLocation, cityLocation, pseudo]);
  */
  const params = [];
  const querySet = [];
  let query = 'UPDATE "user" SET ';
  if (name !== undefined) {
    params.push(name);
    querySet.push(` name = $${params.length} `);
  }
  if (firstname !== undefined) {
    params.push(firstname);
    querySet.push(` firstname = $${params.length} `);
  }
  if (email !== undefined) {
    params.push(email);
    querySet.push(` email = $${params.length} `);
  }
  if (password !== undefined) {
    params.push(await getHash(password));
    querySet.push(` password = $${params.length} `);
  }
  if (nbPearls !== undefined) {
    params.push(nbPearls);
    querySet.push(` nbPearls = $${params.length} `);
  }
  if (helpCounter !== undefined) {
    params.push(helpCounter);
    querySet.push(` helpCounter = $${params.length} `);
  }
  if (phone !== undefined) {
    params.push(phone);
    querySet.push(` phone = $${params.length} `);
  }
  if (description !== undefined) {
    params.push(description);
    querySet.push(` description = $${params.length} `);
  }
  if (streetName !== undefined) {
    params.push(streetName);
    querySet.push(` streetName = $${params.length} `);
  }
  if (streetNumber !== undefined) {
    params.push(streetNumber);
    querySet.push(` streetNumber = $${params.length} `);
  }
  if (isAdmin !== undefined) {
    params.push(isAdmin);
    querySet.push(` isAdmin = $${params.length} `);
  }
  if (zipCodeLocation !== undefined) {
    params.push(zipCodeLocation);
    querySet.push(` zipCodeLocation = $${params.length} `);
  }
  if (cityLocation !== undefined) {
    params.push(cityLocation);
    querySet.push(` cityLocation = $${params.length} `);
  }

  query += querySet.join(",");
  params.push(pseudo);
  query += `WHERE (pseudo = $${params.length})`;

  return await client.query(query, params);
};

module.exports.deleteUser = async (pseudo, client) => {
  return await client.query('DELETE FROM "user" WHERE pseudo = $1', [pseudo]);
};

module.exports.userExist = async (client, pseudo) => {
  const { rows } = await client.query('SELECT count(pseudo) AS nbr FROM "user" WHERE pseudo = $1', [
    pseudo,
  ]);
  return rows[0].nbr > 0;
};

module.exports.emailExist = async (client, email) => {
  const { rows } = await client.query('SELECT count(email) AS nbr FROM "user" WHERE email = $1', [
    email,
  ]);
  return rows[0].nbr > 0;
};

module.exports.searchAllUser = async (client, search) => {
  return await client.query(
    `SELECT pseudo, firstname, name FROM "user" WHERE pseudo LIKE '%' || $1 || '%' OR name  LIKE '%' || $1 || '%' OR firstname  LIKE '%' || $1 || '%'`,
    [search]
  );
};

module.exports.locationUsedByUser = async (client, zipCode, city) => {
  const { rows } = await client.query(
    'SELECT count(*) AS nbr FROM "user" WHERE zipCodeLocation = $1 AND cityLocation = $2',
    [zipCode, city]
  );
  return rows[0].nbr > 0;
};
