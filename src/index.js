const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./routes')
require('dotenv').config()

const port = process.env.PORT || 5000

// Server will config for CORS policy so that client can call API to server!
app.use(
	cors({
		origin: process.env.URL_CLIENT,
		credentials: true,
	})
)

// Allow client to send data with application/json
app.use(express.json())

// Using middleware to parse data of body (client will use POST method)
app.use(
	express.urlencoded({
		extended: true,
	})
)

router(app)

app.get('/', (req, res) => {
	res.send(`Server is listening on port ${port}`)
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})
