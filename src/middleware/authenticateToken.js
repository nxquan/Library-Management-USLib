const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
	const accessToken = req.cookies.access_token
	if (!!accessToken) return res.sendStatus(401) // Unauthorized
	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
		if (err) res.sendStatus(403) //Forbidden
		next()
	})
}

module.exports = authenticateToken
