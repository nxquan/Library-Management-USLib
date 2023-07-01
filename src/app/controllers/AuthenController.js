const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, RefreshToken, Reader } = require('../model')
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
	async register(req, res) {
		const { id, type } = req.body
		if (type === 'student') {
			// Check if id exists in University of Science
			const inforOfUserFromUS = await User.findUSOne('id', id)

			if (!!inforOfUserFromUS) {
				const isExisting = await User.findById(id)

				if (!isExisting) {
					const password = AuthenController.generatePassword()
					const transporter = await createTransporter()
					await transporter.sendMail({
						to: `${id}@student.hcmus.edu.vn`,
						subject: 'Kích hoạt tài khoản',
						html: `<h2>Chúc mừng, bạn đã kích hoạt tài khoản thư viện thành công</h2>\n<h3>Mật khẩu là: ${password}</h3>\n<p>Hãy dùng nó để đăng nhập!</p>`,
					})

					const salt = bcrypt.genSaltSync(10)
					const hashPassword = bcrypt.hashSync(password, salt)
					const data = {
						id,
						password: hashPassword,
						has_card: false,
						type: 'student',
					}

					const readerCard = await Reader.findOne(id)

					if (readerCard) {
						data.has_card = true
					}
					const result = await User.createOne(data)

					if (result) {
						return res.json({
							msg: 'Đăng ký thành công',
							status: 201,
							result: true,
						})
					} else {
						return res.json({
							msg: 'Xảy ra lỗi hệ thống',
							status: 500,
							result: false,
						})
					}
				} else {
					return res.json({
						msg: 'Mã số đã được đăng ký. Hãy quên mật khẩu để lấy lại!',
						status: 200,
						result: false,
					})
				}
			} else {
				return res.json({
					msg: 'Mã số không tồn tại. Vui lòng nhập chính xác mã!',
					status: 200,
					result: false,
				})
			}
		} else {
			// Check if id exists in University of Science
			const inforOfUserFromUS = await User.findUSOneAdmin('id', id)

			if (!!inforOfUserFromUS) {
				const isExisting = await User.findById(id)

				if (!isExisting) {
					const password = '123456'

					const salt = bcrypt.genSaltSync(10)
					const hashPassword = bcrypt.hashSync(password, salt)
					const data = {
						id,
						password: hashPassword,
						type: 'admin',
					}

					const result = await User.createOne(data)

					if (result) {
						return res.json({
							msg: 'Đăng ký thành công',
							status: 201,
							result: true,
						})
					} else {
						return res.json({
							msg: 'Xảy ra lỗi hệ thống',
							status: 500,
							result: false,
						})
					}
				} else {
					return res.json({
						msg: 'Mã số đã được đăng ký. Hãy quên mật khẩu để lấy lại!',
						status: 200,
						result: false,
					})
				}
			} else {
				return res.json({
					msg: 'Mã số không tồn tại. Vui lòng nhập chính xác mã!',
					status: 200,
					result: false,
				})
			}
		}
	}

	// [POST] /api/auth/login [id, password]
	async login(req, res) {
		let existingUser = await User.findOne('id', req.body.id)

		if (!existingUser)
			return res.json({
				msg: 'Mã số chưa đăng ký',
				msgEnglish: 'The code number is not registered!',
				result: false,
			})

		let result = bcrypt.compareSync(req.body.password, existingUser.password)

		if (result) {
			const accessToken = jwt.sign({ id: req.body.id }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '15m',
			})

			const refreshToken = jwt.sign({ id: req.body.id }, process.env.REFRESH_TOKEN_SECRET)
			await RefreshToken.create({ token: refreshToken })

			res.cookie('access_token', accessToken, {
				maxAge: 1000 * 60 * 15,
				httpOnly: true,
			})

			return res.json({ result: true, refreshToken, type: existingUser.type })
		} else
			return res.json({
				msg: 'Mật khẩu không chính xác',
				status: false,
			})
	}

	// // [POST] /api/auth/refresh-token [id, refreshToken]
	async refreshToken(req, res) {
		const refreshToken = req.body.refreshToken
		if (!refreshToken) return res.sendStatus(401)

		const result = await RefreshToken.findOne(refreshToken)
		if (!result) return res.sendStatus(403)

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
			if (err) return res.sendStatus(403)

			const accessToken = jwt.sign({ id: req.body.id }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '15m',
			})

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
			if (err) res.sendStatus(403) //Forbidden
			try {
				await RefreshToken.deleteOne('token', refreshToken)
				return res.json({ status: 200, result: true })
			} catch (er) {
				return res.json({ status: 200, result: false })
			}
		})
	}

	// [POST] /api/auth/change-password [id, current_password, new_password]
	async changePassword(req, res) {
		const inforOfUser = await User.findOne('id', req.body.id)
		if (!inforOfUser) {
			return res.json({ msg: 'ID không chính xác', status: 200 })
		}
		let result = bcrypt.compareSync(req.body.current_password, inforOfUser.password)

		if (result) {
			const salt = bcrypt.genSaltSync(10)
			const hash = bcrypt.hashSync(req.body.new_password, salt)

			await User.updateOne(req.body.id, {
				password: hash,
			})

			return res.json({ msg: 'Thay đổi mật khẩu thành công', status: 200, result: true })
		} else {
			return res.json({ msg: 'Mật khẩu cũ không chính xác', status: 200, result: true })
		}
	}
}

module.exports = new AuthenController()
