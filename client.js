const url = require("url")
const express = require("express")
const bodyParser = require("body-parser")
const { randomString } = require("./utils")

const config = {
	port: 9000,

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
}
let state = ""

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/authorize", (req, res) => {
	state = randomString()
	const redirectUrl = url.parse(config.authorizationServerAddress)
	redirectUrl.query = {
		response_type: "code",
		client_id: config.clientId,
		client_secret: config.clientSecret,
		redirect_uri: config.redirectUri,
		scope: "name dob",
		state: state,
	}
	res.redirect(url.format(redirectUrl))
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
	console.log("OAuth Client is listening at http://%s:%s", host, port)
})
