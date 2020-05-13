const assert = require("assert")
const request = require("supertest")

const { app } = require("../../authorization-server")

it("/token should return 401 if authorization header doesn't have the correct credentials @authorization-server-check-authorization-valid", () => {
	return request(app)
		.post("/token")
		.set("authorization", "Basic dGVzdC1jbGllbnQ6VdFNlY3JldA==")
		.send({})
		.then((res) => {
			assert.equal(
				res.status,
				401,
				"The `/token` route should return a 401 if authorization header isn't valid"
			)
		})
})
