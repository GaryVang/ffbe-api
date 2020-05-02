const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const unit = require("./controllers/unit");
const equipment = require("./controllers/equipment");
const materia = require("./controllers/materia");

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/unit", unit.handleGetUnitList(db));
app.get("/unit/:id", unit.handleGetUnit(db));

app.get("/equipment", equipment.handleGetEquipmentList(db));
app.get("/equipment/:id", equipment.handleGetEquipment(db));

app.get("/materia", materia.handleGetMateriaList(db));

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
