module.exports.getLocation = async (zipCode, city, client) => {
    return await client.query('SELECT * FROM "location" WHERE zipCode = $1 AND city = $2', [zipCode, city]);
};

module.exports.getAllLocation = async (client) => {
  return await client.query('SELECT * FROM "location"');
};
  
module.exports.postLocation = async (zipCode, city, client) => {
    return await client.query('INSERT INTO "location"(zipCode, city) VALUES ($1, $2)', [zipCode, city]);
}

module.exports.deleteLocation = async (zipCode, city, client) => {
  return await client.query('DELETE FROM "location" WHERE zipCode = $1 AND city = $2', [zipCode, city]);
}
  
module.exports.locationExist = async (zipCode, city, client) => {
  const {rows} = await client.query('SELECT count(zipCode) AS nbr FROM location WHERE zipCode = $1 AND city = $2', [zipCode, city]);
  return rows[0].nbr > 0;
}