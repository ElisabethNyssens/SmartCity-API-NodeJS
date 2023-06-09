const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
 definition: {
 openapi: '3.0.0',
 info: {
 title: 'Ecomini', // Title (required)
 version: '1.0.0', // Version (required)
 },
 },
 // Path to the API docs
 apis: [
 './controleur/*',
 './middleware/*',
 './modele/*',
 './route/*',
 ],
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync('./swagger/spec.json', JSON.stringify(swaggerSpec));