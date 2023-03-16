module.exports.getAllAd = async (client) => {
  return await client.query("SELECT * FROM ad");
};

module.exports.getAd = async (id, client) => {
  return await client.query("SELECT * FROM ad WHERE id = $1", [id]);
};

module.exports.getAllAdByPseudo = async (author, client) => {
  return await client.query("SELECT * FROM ad WHERE author = $1 AND booking IS NULL", [author]);
};

// MY RESERVATIONS
module.exports.getAllCurrentAdsForUser = async (user, client) => {
  return await client.query(
    `SELECT * FROM ad WHERE booking IS NOT NULL AND  booking IN (SELECT id FROM booking WHERE "user" = $1 AND id IN (SELECT booking FROM review WHERE author = $1))`,
    [user]
  );
};

// MY ADS
module.exports.getAllCurrentAdsFromUser = async (user, client) => {
  return await client.query(
    "SELECT * FROM ad WHERE author = $1 AND booking IS NOT NULL AND booking IN (SELECT booking FROM review WHERE author = $1)",
    [user]
  );
};

module.exports.getAllAdByPseudo = async (author, client) => {
  return await client.query("SELECT * FROM ad WHERE author = $1 AND booking IS NULL", [author]);
};

module.exports.postAd = async (
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
) => {
  return await client.query(
    "INSERT INTO ad(title, content, creationDate, streetName, streetNumber, author, serviceDate, availability,  booking, zipCodeLocation, cityLocation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
    [
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
    ]
  );
};

module.exports.updateAd = async (
  client,
  id,
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
  cityLocation
) => {
  const params = [];
  const querySet = [];
  let query = "UPDATE ad SET ";
  if (title !== undefined) {
    params.push(title);
    querySet.push(` title = $${params.length} `);
  }
  if (content !== undefined) {
    params.push(content);
    querySet.push(` content = $${params.length} `);
  }
  if (creationDate !== undefined) {
    params.push(creationDate);
    querySet.push(` creationDate = $${params.length} `);
  }
  if (streetName !== undefined) {
    params.push(streetName);
    querySet.push(` streetName = $${params.length} `);
  }
  if (streetNumber !== undefined) {
    params.push(streetNumber);
    querySet.push(` streetNumber = $${params.length} `);
  }
  if (author !== undefined) {
    params.push(author);
    querySet.push(` author = $${params.length} `);
  }
  if (serviceDate !== undefined) {
    params.push(serviceDate);
    querySet.push(` serviceDate = $${params.length} `);
  }
  if (availability !== undefined) {
    params.push(availability);
    querySet.push(` availability = $${params.length} `);
  }
  if (booking !== undefined) {
    params.push(booking);
    querySet.push(` booking = $${params.length} `);
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
  params.push(id);
  query += `WHERE (id = $${params.length})`;

  return client.query(query, params);
};

module.exports.deleteAd = async (id, client) => {
  return await client.query("DELETE FROM ad WHERE id = $1", [id]);
};

module.exports.adExist = async (client, id) => {
  const { rows } = await client.query("SELECT count(id) AS nbr FROM ad WHERE id = $1", [id]);
  return rows[0].nbr > 0;
};

module.exports.getAdFromBooking = async (client, id) => {
  return await client.query("SELECT * FROM ad WHERE booking = $1", [id]);
};

module.exports.searchAllAdByTitle = async (client, title) => {
  return await client.query(
    `SELECT * FROM ad  WHERE title LIKE '%' || $1 || '%' OR content LIKE '%' || $1 || '%'`,
    [title]
  );
};

module.exports.getAllAdByCity = async (city, client) => {
  return await client.query("SELECT * FROM ad WHERE cityLocation = $1 AND booking IS NULL", [city]);
};

// MY RESERVATIONS
module.exports.getAllCurrentAdsForUser = async (user, client) => {
  return await client.query(
    `SELECT * FROM ad WHERE booking IS NOT NULL AND  booking IN (SELECT id FROM booking WHERE "user" = $1 AND id NOT IN (SELECT booking FROM review WHERE author = $1))`,
    [user]
  );
};

// MY ADS
module.exports.getAllCurrentAdsFromUser = async (user, client) => {
  return await client.query(
    "SELECT * FROM ad WHERE author = $1 AND booking IS NOT NULL AND booking NOT IN (SELECT booking FROM review WHERE author = $1)",
    [user]
  );
};
