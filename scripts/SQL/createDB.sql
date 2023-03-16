DROP TABLE IF EXISTS "location" CASCADE;
CREATE TABLE "location" (
    zipCode integer not null,
    city varchar not null,
    PRIMARY KEY (zipCode, city)
);

INSERT INTO "location"(zipCode, city) VALUES ('5000', 'Namur');
INSERT INTO "location"(zipCode, city) VALUES ('6000', 'Charleroi');
INSERT INTO "location"(zipCode, city) VALUES ('4000', 'Liège');
INSERT INTO "location"(zipCode, city) VALUES ('5500', 'Dinant');
INSERT INTO "location"(zipCode, city) VALUES ('1348', 'Louvain-la-Neuve');


DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
    pseudo varchar PRIMARY KEY,
    "name" varchar not null,
    firstname varchar not null,
    streetName varchar not null,
    streetNumber integer not null,
    email varchar UNIQUE,
    "password" varchar not null,
    phone varchar not null,
    nbPearls integer not null CONSTRAINT defaultPearls DEFAULT 0,
    helpCounter integer not null CONSTRAINT defaultCounter DEFAULT 0,
    "description" varchar,
    isAdmin boolean,
    zipCodeLocation integer not null,
    cityLocation varchar not null,
    foreign key (zipCodeLocation,  cityLocation)  REFERENCES "location"(zipCode, city) ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE
);
-- DEFERRABLE INITIALLY IMMEDIATE permet de reporter la contrainte (ex au momment d'un commit)
-- pas vérif à chaque fois, lire BD à la fin


--password123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Butterfly', 'Dupuis', 'Alice', 'dupuis.alice@gmail.com','$2b$10$j3AGNP0HVJxXYpys4IvQgepSKLyirLmod2KbBXY.lFiApAJCGacJ6', '0410101010',  0, 0,'Etudiante en 2ème IG', false, 'Rue des Tulipes', 14, 5000, 'Namur');

--password456
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Tornado', 'Martin', 'Paul', 'martin.paul@hotmail.com','$2b$10$qXXokrIDQAdXyCjlCuzFCun3lgOSoc.r/h9kSt4unDZKX0T7x6rSC', '0452139453',  0, 0,'Etudiant en 1ère année de médecine', false, 'Rue Haute Marcel', 12, 6000, 'Charleroi');

--password456859
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Plume', 'Mei', 'Jhin', 'mei.jhin@hotmail.com','$2b$10$JHCGDIXYRx26hj7D1XiOD.47.pm7U.ZszlT5kVSLirA7hbL0lCI6S', '0452139454',  0, 1,'Mannequin et maman de 2 enfants.', false, 'Rue de l''église', 14, 4000, 'Liège');

--coucou123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Babette', 'Nyssens', 'Elisabeth', 'eli.nyssens@gmail.com','$2b$10$z9Hvzfw3sCJ6wgFs3it77OuiszBaTNEEgdnVbC8g5ng5yS8OetedG', '0495101010',  0, 2,'Etudiante en 3ème Informatique de Gestion à l''Hénallux', true, 'Rue de la Citronnelle', 5, 1348, 'Louvain-la-Neuve');

--password123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Caroneko', 'Dubois', 'Caroline', 'caro.dubois@gmail.com','$2b$10$j3AGNP0HVJxXYpys4IvQgepSKLyirLmod2KbBXY.lFiApAJCGacJ6', '0490708990',  0, 0,'Etudiante en 3ème IG', false, 'Rue de Gembloux', 56, 5000, 'Namur');
 
--password123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Bebou', 'Louis', 'Sarah', 'sarah.louis@gmail.com','$2b$10$j3AGNP0HVJxXYpys4IvQgepSKLyirLmod2KbBXY.lFiApAJCGacJ6', '0498763460',  1, 0,'Etudiante en 3ème IG', false, 'Rue de la justice', 102, 5500, 'Dinant');

--password123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Floflo', 'Piette', 'Florian', 'florian.piette@gmail.com','$2b$10$j3AGNP0HVJxXYpys4IvQgepSKLyirLmod2KbBXY.lFiApAJCGacJ6', '0496553344',  1, 0,'J''ai 32 ans et je travaille dans une jardinerie à Liège. J''adore la nature.', false, 'Rue des écureuils', 32, 4000, 'Liège');

--password123
INSERT INTO "user" (
    pseudo, "name", firstname, email, "password", phone, nbPearls, helpCounter, "description", isAdmin, streetName, streetNumber, zipCodeLocation, cityLocation
    ) VALUES ('Steph99', 'Vanoost', 'Stéphanie', 'steph.vanoost@gmail.com','$2b$10$j3AGNP0HVJxXYpys4IvQgepSKLyirLmod2KbBXY.lFiApAJCGacJ6', '0498761423',  1, 0,'Etudiante en bio ingé à l''UCL. J''adore aider les autres et faire de nouvelles connaissances.', false, 'Rue des blancs chevaux', 18, 1348, 'Louvain-la-Neuve');


DROP TABLE IF EXISTS booking CASCADE;
CREATE TABLE booking (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "date" date not null,
    "state" varchar not null,
    "user" varchar not null REFERENCES "user"(pseudo) ON DELETE SET NULL 
);

INSERT INTO booking ("date", "state", "user") VALUES ('2022-09-18', 'Cloturé', 'Floflo');
INSERT INTO booking ("date", "state", "user") VALUES ('2022-11-03', 'Cloturé', 'Steph99');
INSERT INTO booking ("date", "state", "user") VALUES ('2022-10-14', 'Cloturé', 'Bebou');
INSERT INTO booking ("date", "state",  "user") VALUES ('2022-12-17', 'En cours', 'Tornado');
INSERT INTO booking ("date", "state", "user") VALUES ('2022-12-17', 'En attente d''approbation', 'Babette');

    


DROP TABLE IF EXISTS ad CASCADE;
CREATE TABLE ad (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar not null,
    content varchar not null,
    creationDate date not null,
    streetName varchar not null,
    streetNumber integer not null,
    author varchar not null REFERENCES "user"(pseudo) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
    serviceDate date not null,
    "availability" varchar not null,
    booking integer REFERENCES booking(id) ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE,
    zipCodeLocation integer not null,
    cityLocation varchar not null,
    foreign key (zipCodeLocation,  cityLocation) REFERENCES "location"(zipCode, city) ON DELETE SET NULL DEFERRABLE INITIALLY IMMEDIATE
);

INSERT INTO ad (
    title,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    booking,
    zipCodeLocation,
    cityLocation
) VALUES ('Tondeuse à gazon ','À la recherche d''une tondeuse à gazon à prêter ou louer.', '2022-09-15','Rue de l''église', 14,'Plume', '2022-09-22', 'Toute la journée', 1, 4000, 'Liège');

INSERT INTO ad (
    title ,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    zipCodeLocation,
    cityLocation
) VALUES ('Cours de langues','À la recherche de quelqu''un pour parler anglais ou néérlandais avec moi et me corriger.', '2022-10-25','Rue Haute Marcel', 12,'Tornado', '2023-03-24', 'Après-midi', 6000, 'Charleroi');

INSERT INTO ad (
    title,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    zipCodeLocation,
    cityLocation
) VALUES ('Aide déménagement 📦','Recherche de l''aide pour déplacer des meubles.', '2022-10-12','Rue de l''église', 14,'Plume', '2023-03-25', 'Après-midi', 4000, 'Liège');

INSERT INTO ad (
    title,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    booking,
    zipCodeLocation,
    cityLocation
) VALUES ('Planche à repasser','Je recherche une planche à repasser à prêter pour 1h ou 2. J''offre des cookies en échange!','2022-10-26' ,'Rue de la Citronnelle', 5,'Babette','2022-11-05', 'Après-midi', 2, 1348, 'Louvain-la-Neuve');

INSERT INTO ad (
    title,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    booking,
    zipCodeLocation,
    cityLocation
) VALUES ('Déguisement dinosaure','Je recherche un déguisement de dinosaure à prêter pour une soirée le 28/11/22','2022-09-27' ,'Rue de la Citronnelle', 5,'Babette','2022-11-27', 'Toute la journée', 3, 1348, 'Louvain-la-Neuve');

INSERT INTO ad (
    title,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    zipCodeLocation,
    cityLocation
) VALUES ('Arrosage plantes 🪴','Je recherche une personne qui pourrait passer arroser mes plantes pendant que je serai en vacances la semaine du 05/10/22.', '2022-12-15','Rue des Tulipes', 14,'Butterfly', '2023-02-02','Toute la journée', 5000, 'Namur');

INSERT INTO ad (
    title ,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    zipCodeLocation,
    cityLocation
) VALUES ('Appareil à raclette 🧀','Je recherche un appareil à raclette à prêter pour un repas entre cokoteurs 😋 J''offre du chocolat en échange! 🍫', '2022-12-17','Rue de Gembloux', 56,'Caroneko', '2023-01-25', 'Matin', 5000, 'Namur');

INSERT INTO ad (
    title ,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    booking,
    zipCodeLocation,
    cityLocation
) VALUES ('Covoiturage / taxi 🚕','Je recherche quelqu''un pour me conduire à l''aéroport de Charleroi le 2 février à 19h. (Départ de Louvain-la-Neuve)', '2022-12-15','Rue d’Heppignies', 10,'Babette', '2023-02-02', 'Soirée',4, 6000, 'Charleroi');

INSERT INTO ad (
    title ,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    booking,
    zipCodeLocation,
    cityLocation
) VALUES ('Babysitter','Je recherche un.e babysitter (au moins 18 ans et avec le permis de conduire) pour mes 2 enfants (4 et 6 ans) le 28 janvier. Je rémunère 10€ de l''heure.', '2022-12-15','Rue de l''église', 14,'Plume', '2023-02-02', 'Soirée',5, 4000, 'Liège');

INSERT INTO ad (
    title ,
    content,
    creationDate,
    streetName,
    streetNumber,
    author,
    serviceDate,
    "availability",
    zipCodeLocation,
    cityLocation
) VALUES ('Dogsitter 🐶','Je recherche une personne pour promener mon chien, Jack, pendant mon absence.', '2022-12-13','Rue des blancs chevaux', 18,'Steph99', '2023-02-04', 'Après-midi', 1348, 'Louvain-la-Neuve');



DROP TABLE IF EXISTS subscription CASCADE;
CREATE TABLE subscription (
    pseudoSubscriber varchar not null REFERENCES "user"(pseudo) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
    pseudoSubscription varchar not null REFERENCES "user"(pseudo) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
    PRIMARY KEY (pseudoSubscriber, pseudoSubscription)
);

INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Butterfly', 'Tornado');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Butterfly', 'Plume');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Floflo', 'Plume');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Tornado', 'Butterfly');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Babette', 'Bebou');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Babette', 'Caroneko');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Babette', 'Plume');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Bebou', 'Caroneko');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Bebou', 'Babette');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Steph99', 'Babette');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Babette', 'Steph99');
INSERT INTO subscription(pseudoSubscriber, pseudoSubscription) VALUES ('Steph99', 'Butterfly');


DROP TABLE IF EXISTS review CASCADE;
CREATE TABLE review (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    score integer not null,
    comment varchar not null,
    "date" date not null,
    booking integer not null REFERENCES booking(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
    author varchar not null REFERENCES "user"(pseudo) ON DELETE CASCADE  DEFERRABLE INITIALLY IMMEDIATE,
    recipient varchar not null REFERENCES "user"(pseudo) ON DELETE CASCADE  DEFERRABLE INITIALLY IMMEDIATE
);

INSERT INTO review (score, comment, date, booking, author, recipient) 
VALUES (5,'Jhin est une personne soigneuse et honnête, je lui ai prété ma tondeuse à gazon et elle m''a offert un beau cadeau en échange. Je l''aiderai encore avec plaisir', '2022-09-23', 1, 'Floflo','Plume');

INSERT INTO review (score, comment, date, booking, author, recipient) 
VALUES (5,'Florian est super sympa et m''a prêté sa tondeuse à gazon sans rien attendre en retour!', '2022-09-25', 1, 'Plume','Floflo');

INSERT INTO review (score, comment, date, booking, author, recipient) 
VALUES (5,'Encore un grand merci Stéphanie de m''avoir prété ta planche à repasser! 😊', '2022-11-03', 2, 'Babette','Steph99');

INSERT INTO review (score, comment, date, booking, author, recipient)
VALUES (4,'Elisabeth est très sympa, je lui ai prêté ma planche à repasser et elle m''a offert des cookies pour me remercier 🍪 Le seul bémol est que j''ai dû faire le déplacement moi-même.', '2022-11-03', 2, 'Steph99','Babette');

INSERT INTO review (score, comment, date, booking, author, recipient)  
VALUES (5,'Sarah m''a prété un déguisement de dinosaure pour ma fête d''anniversaire 🦖 tout le monde l''a adoré!! 😍', '2022-11-29', 3, 'Babette','Bebou');

INSERT INTO review (score, comment, date, booking, author, recipient) 
VALUES (3,'J''ai prété un déguisement de dinosaure à Elisabeth, elle a été soigneuse mais ne l''a pas lavé avant de me le rendre donc il sent encore la bière 🍺', '2022-12-03', 3, 'Bebou','Babette');



