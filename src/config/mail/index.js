const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_MAILER_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.CLIENT_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS = 'uslibserver@gmail.com';

const myOAuth2Client = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET);

myOAuth2Client.setCredentials({
	refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

async function createTransporter() {
	const myAccessTokenObject = await myOAuth2Client.getAccessToken();
	const myAccessToken = myAccessTokenObject?.token;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: ADMIN_EMAIL_ADDRESS,
			clientId: GOOGLE_MAILER_CLIENT_ID,
			clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
			refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
			accessToken: myAccessToken,
		},
	});

	return transporter;
}

module.exports = { createTransporter };
