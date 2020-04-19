const url = require("url")
const express = require("express")
const bodyParser = require("body-parser")
const { randomString } = require("./utils")

const config = {
	port: 9001,

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
}
let state = ""

const app = express()
app.set("view engine", "ejs")
app.set("views", "assets/authorization-server")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/authorize", (req, res) => {
	res.render("login", {
		client: {},
		scope: "",
		requestId: "",
	})
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
	console.log("OAuth Client is listening at http://%s:%s", host, port)
})
