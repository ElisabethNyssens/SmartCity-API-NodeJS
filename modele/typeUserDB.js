const { getUser } = require("./userDB");
const { compareHash } = require("../utils.js/utils");

module.exports.getUser = async (client, pseudo, password) => {
  const promises = [];
  const promiseClient = getUser(pseudo, client);
  promises.push(promiseClient);
  const values = await Promise.all(promises);
  const clientRow = values[0].rows[0];

  if (
    clientRow !== undefined &&
    (await compareHash(password, clientRow.password)) &&
    !clientRow.isadmin
  ) {
    return { userType: "client", value: clientRow };
  } else if (
    clientRow !== undefined &&
    (await compareHash(password, clientRow.password)) &&
    clientRow.isadmin
  ) {
    return { userType: "manager", value: clientRow };
  } else {
    if (clientRow === undefined) {
      return { userType: "inconnu", value: "Pseudo not found" };
    } else if (!(await compareHash(password, clientRow.password))) {
      return { userType: "inconnu", value: "Wrong password" };
    }
  }
};
