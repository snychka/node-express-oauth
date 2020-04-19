const crypto = require("crypto")

function randomString() {
	const randomBytes = crypto.randomBytes(20)
	return randomBytes.toString("base64")
}

function containsAll(arr1, arr2) {
	const arr1Set = new Set()
	for (let i = 0; i < arr1.length; i++) {
		arr1Set.add(arr1[i])
	}

	for (let i = 0; i < arr2.length; i++) {
		if (!arr1Set.has(arr2[i])) {
			return false
		}
	}
	return true
}

module.exports = {
	randomString,
	containsAll,
}
