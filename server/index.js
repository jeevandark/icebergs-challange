const express = require("express");
const bodyParser = require("body-parser");
const crossLines = require("./crossLines");

const app = express();

app.use(bodyParser.json());

app.post("/fsp", (req, res) => {
	// todo: if something is missing, return an error

	res.end();
});

app.listen(4000, () =>
	console.log("Listening for http requests on port 4000...")
);
