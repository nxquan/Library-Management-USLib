const express = require('express')
const cors = require('cors')
const app = express()
// const morgan = require('morgan');
const nodemailer = require('nodemailer')

require('dotenv').config()
const authRouter = require('./routes/authen.route')
const port = process.env.AUTHEN_PORT || 5500

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

// Config logger for server. When client call any API, server will log
// app.use(morgan('combined'));

// Handle routes
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
	res.send(`Server Authentication is listening on port ${port}`)
})

app.listen(port, () => {
	console.log(`Server Authentication is listening on port ${port}`)
})
