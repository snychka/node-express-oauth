const url = require("url")
const express = require("express")
const bodyParser = require("body-parser")
const { randomString, containsAll } = require("./utils")

const config = {
	port: 9001,

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
}

const clients = {
	"my-client": {
		name: "Sample Client",
		clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
		scopes: ["name", "dob"],
	},
	"test-client": {
		name: "Test Client",
		clientSecret: "TestSecret",
		scopes: ["name"],
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/authorize", (req, res) => {
	const clientId = req.query.client_id
	const client = clients[clientId]
	if (!client) {
		res.status(401).send("Error: client not authorized")
		return
	}

	if (
		typeof req.query.scope !== "string" ||
		!containsAll(client.scopes, req.query.scope.split(" "))
	) {
		res.status(401).send("Error: invalid scopes requested")
		return
	}
	const requestId = randomString()
	requests[requestId] = req.query

	res.render("login", {
		client,
		scope: req.query.scope,
		requestId,
	})
})

app.post("/approve", (req, res) => {
	const { userName, password, requestId } = req.body
	if (!userName || users[userName] !== password) {
		res.status(401).send("Error: user not authorized")
		return
	}

	const userReq = requests[requestId]
	delete requests[requestId]
	if (!userReq) {
		res.status(401).send("Error: invalid user request")
		return
	}

	if (userReq.response_type !== "code") {
		res.status(400).send("Error: unsupported response type")
		return
	}
	const code = randomString()
	authorizationCodes[code] = userReq

	const redirectUri = url.parse(userReq.redirect_uri)
	redirectUri.query = {
		code,
		state: userReq.state,
	}

	res.redirect(url.format(redirectUri))
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
	console.log("OAuth Client is listening at http://%s:%s", host, port)
})
