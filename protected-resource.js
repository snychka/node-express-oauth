const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const { timeout } = require("./utils")
const jwt = require('jsonwebtoken');

const config = {
	port: 9002,
	publicKey: fs.readFileSync("assets/public_key.pem"),
}

const users = {
	user1: {
		username: "user1",
		name: "User 1",
		date_of_birth: "7th October 1990",
		weight: 57,
	},
	john: {
		username: "john",
		name: "John Appleseed",
		date_of_birth: "12th September 1998",
		weight: 87,
	},
}

const app = express()
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
Your code here
*/

app.get('/user-info', (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).end();
    return;
  }
  const prefix = 'bearer ';
  const payload = req.headers.authorization.slice(prefix.length);
  let decoded;

  try {
    decoded = jwt.verify(payload, config.publicKey, {algorithms: ['RS256']});
    //console.log('decode: ' + JSON.stringify(x));
  } catch { res.status(401).end(); return;}

  let json = {};
  let {userName, scope} = decoded;
  let arr = scope.split(' ');
  const prefix2 = 'permission:'
  for (const i of arr) {
    let perm = i.slice(prefix2.length);
    json[perm] = users[userName][perm];
  }
  res.json(json);

});

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

module.exports = {
	app,
	server,
}
