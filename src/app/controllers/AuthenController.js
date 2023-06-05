const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { doc, addDoc, getDoc, getDocs, collection } = require('firebase/firestore/lite')

const { User, UserCollection, findOne } = require('../model/User')

const RefreshToken = require('../model/RefreshToken')
const { createTransporter } = require('../../config/mail')

class AuthenController {
	static generatePassword() {
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		var passwordLength = 12
		var password = ''
		for (var i = 0; i < passwordLength; i++) {
			const index = Math.floor(Math.random() * chars.length)
			password += chars[index]
		}
		return password
	}

	// [POST] /api/auth/register [id, type]
	async register(req, res, next) {
		const { id, type } = req.body
		// Check if id exists in University of Science
		const queryResultUS = query(USStudentCollection, where('id', '==', id))
		const querySnapshotUS = await getDocs(queryResultUS)

		if (querySnapshotUS.docs.at(0).exists()) {
			const inforOfUserFromUS = querySnapshotUS.docs.at(0).data()

			const queryResult = query(UserCollection, where('id', '==', id))
			const querySnapshot = await getDocs(queryResult)

			if (querySnapshot.empty) {
				const password = AuthenController.generatePassword()
				try {
					const transporter = await createTransporter()
					await transporter.sendMail({
						to: `${id}@student.hcmus.edu.vn`,
						subject: 'Kích hoạt tài khoản',
						html: `<h2>Chúc mừng, bạn đã kích hoạt hành công</h2>\n<h3>Mật khẩu là: </h3> ${password} \n<p>Hãy dùng nó để đăng nhập!</p>`,
					})

					const salt = await bcrypt.genSaltSync(10)
					const hash = await bcrypt.hashSync(password, salt)
					const data = {
						id: id,
						name: inforOfUserFromUS.name,
						password: hash,
						type: type,
						typeOfReader: 'DocGiaA',
						birthday: inforOfUserFromUS.birthday,
						address: inforOfUserFromUS.address,
						email: inforOfUserFromUS.email,
					}

					await addDoc(UserCollection, data)
					return res.json({
						msg: 'Đăng ký thành công',
						statusCode: 200,
						result: true,
					})
				} catch (er) {
					console.log(er)
				}
			} else {
				return res.json({
					msg: 'Mã số đã được đăng ký. Hãy quên mật khẩu để lấy lại!',
					statusCode: 200,
					result: false,
				})
			}
		} else {
			return res.json({
				msg: 'Mã số không tồn tại. Vui lòng nhập chính xác mã!',
				statusCode: 200,
				result: false,
			})
		}
	}

	// [POST] /api/auth/login [phone, password]
	async login(req, res, next) {
		console.log(req.body.code)
		let existingUser = await findOne(req.body.code)
		if (!existingUser)
			return res.json({
				msg: 'Mã số chưa đăng ký',
				msgEnglish: 'The code number is not registered!',
				result: false,
			})
		let result = bcrypt.compareSync(req.body.password, existingUser.password)

		if (result) {
			const accessToken = jwt.sign({ code: req.body.code }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '15m',
			})

			const refreshToken = jwt.sign({ code: req.body.code }, process.env.REFRESH_TOKEN_SECRET)
			await RefreshToken.create({ token: refreshToken })

			res.cookie('access_token', accessToken, {
				maxAge: 1000 * 60 * 15,
				httpOnly: true,
			})

			return res.json({ result: true, refreshToken })
		} else
			return res.json({
				msg: 'Mật khẩu không chính xác',
				msgEnglish: 'The password is not exactly!',
				status: false,
			})
	}

	// // [POST] /api/auth/refresh-token [phone, refreshToken]
	async refreshToken(req, res) {
		const refreshToken = req.body.refreshToken
		if (!refreshToken) return res.sendStatus(401)

		const result = await RefreshToken.findOne({ token: refreshToken })
		if (!result) return res.sendStatus(403)

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
			if (err) return res.sendStatus(403)
			const accessToken = jwt.sign(
				{ phone: req.body.phone },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '15m',
				}
			)

			res.cookie('access_token', accessToken, {
				maxAge: 1000 * 60 * 15,
				httpOnly: true,
			})

			return res.json({
				result: true,
			})
		})
	}

	// [POST] /api/auth/log-out [refresh_token]
	async logOut(req, res) {
		const refreshToken = req.body.refresh_token

		if (!refreshToken) return res.sendStatus(401)

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
			// if (err) return res.sendStatus(403)
			// await RefreshToken.deleteOne({ token: refreshToken })
			// return res.json({ result: true })
		})
	}
}

module.exports = new AuthenController()
