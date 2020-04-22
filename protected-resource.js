const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const fs = require("fs")

const config = {
	port: 9002,
	publicKey: fs.readFileSync("assets/public_key.pem"),
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/user-info", (req, res) => {
	const userInfo = getUserInfoFromAccessToken(req)
	if (!userInfo) {
		res.status(401).send("Error: client unauthorized")
		return
	}

	res.json(userInfo)
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
	console.log("OAuth Client is listening at http://%s:%s", host, port)
})

function getToken(req) {
	if (req.headers.authorization) {
		return req.headers.authorization.slice("bearer ".length)
	}
}

function getUserInfoFromAccessToken(req) {
	const authToken = getToken(req)
	if (!authToken) {
		return null
	}

	const userInfo = jwt.verify(authToken, config.publicKey, {
		algorithms: ["RS256"],
	})

	return userInfo
}
