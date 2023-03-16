const express = require("express");
const cors = require("cors");
const internalIp = require("internal-ip");

const Router = require("./route");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(Router);
app.use(express.static("./upload"));

/*

app.post('/ad', upload.fields([
    {name: 'title', maxCount: 1},
    {name: 'streetName', maxCount: 1},
    {name: 'streetNumber', maxCount: 1},
    {name: 'date', maxCount: 1},
    {name: 'content', maxCount: 1},
    {name: 'picture'},
    {name: 'author', maxCount: 1},
    {name: 'zipCodeLocation', maxCount: 1},
    {name: 'cityLocation', maxCount: 1}
  
]), Ad.ad);
*/

const internalIP = internalIp.v4.sync();
app.listen(port, () => {
  console.log(`App listening at http://${internalIP}:${port}`);
  console.log(`Example app listening at http://localhost:${port}`);
});

// permet de lancer l’application et de la faire écouter sur le port indiqué dans la variable du même nom. Quand le serveur écoute, il effectue le callback passé en paramètre
