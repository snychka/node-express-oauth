const crypto = require("crypto")

function randomString() {
	const randomBytes = crypto.randomBytes(20)
	return randomBytes.toString("base64")
}

module.exports = {
	randomString,
}
