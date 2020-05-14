const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const {
	randomString,
	containsAll,
	decodeAuthCredentials,
	timeout,
} = require("./utils")

const config = {
	port: 9001,
	privateKey: fs.readFileSync("assets/private_key.pem"),

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
}

const clients = {
	"my-client": {
		name: "Sample Client",
		clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
		scopes: ["permission:name", "permission:date_of_birth"],
	},
	"test-client": {
		name: "Test Client",
		clientSecret: "TestSecret",
		scopes: ["permission:name"],
	},
}

const users = {
	user1: "password1",
	john: "appleseed",
}

const requests = {}
const authorizationCodes = {}

let state = ""

const app = express()
app.set("view engine", "ejs")
app.set("views", "assets/authorization-server")
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
Your code here
*/

app.get('/authorize', (req, r) => {
  let ci = req.query.client_id;
  if (!clients[ci]) {
    r.status(401).end();
    return;
  } 

  let requested_scopes = req.query.scope.split(' ');
  if (!containsAll(clients[ci].scopes, requested_scopes)) {
    r.status(401).end();
    return;
  }

  let rs = randomString();
  requests[rs] = req.query;

  let page = "login";
  let params = {
    client : clients[ci],
    scope : req.query.scope,
    requestId: rs
  };
  r.render(page, params)

  r.status(200).end();

});

app.post('/approve', (req, res) => {
  /*
  console.log('req.body.password: ' + req.body.password)
  console.log('req.body.username: ' + req.body.password)
  console.log('req.body.password: ' + req.body.password); !== users[req.body.username]));
  */
  //console.log((req.body.password !== users[req.body.userName]));
  if (req.body.password !== users[req.body.userName]) {
    res.status(401).end();
    return;
  }

  if (!requests[req.body.requestId]) {
    res.status(401).end();
    return;
  }
  let cr = requests[req.body.requestId];
  delete requests[req.body.requestId];

  let rs = randomString();
  authorizationCodes[rs] = {
    clientReq: cr,
    userName: req.body.userName
  };

  res.redirect(cr.redirect_uri + '?code=' + encodeURIComponent(rs) + '&state=' + cr.state );

  res.status(200).end();
});

app.post('/token', (req, res) => {
  if(!req.headers.authorization) {
    res.status(401).end();
    return;
  }

  let {clientId, clientSecret} = decodeAuthCredentials(req.headers.authorization);
  if(clients[clientId] !== clientSecret) {
    res.status(401).end();
    return;
  }

  //if(!req.body.code || !authorizationCodes[req.body.code]) {
  if(!authorizationCodes[req.body.code]) {
    res.status(401).end();
    return;
  }
  let ac =authorizationCodes[req.body.code];
  delete authorizationCodes[req.body.code];


});

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes

module.exports = { app, requests, authorizationCodes, server }
