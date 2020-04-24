const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const fs = require("fs")

const config = {
	port: 9002,
	publicKey: fs.readFileSync("assets/public_key.pem"),
}

const users = {
	user1: {
		username: "user1",
		name: "User 1",
		dob: "7th October 1990",
		weight: 57,
	},
	john: {
		username: "john",
		name: "John Appleseed",
		dob: "12th September 1998",
		weight: 87,
	},
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

	const user = users[userInfo.userName]
	const userWithRestrictedFields = {}
	const scope = userInfo.scope.split(" ")
	for (let i = 0; i < scope.length; i++) {
		const field = scope[i]
		userWithRestrictedFields[field] = user[field]
	}

	res.json(userWithRestrictedFields)
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
