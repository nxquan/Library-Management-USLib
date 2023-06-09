const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');

const { createTransporter } = require('../../config/mail');

class AuthenController {
	static generatePassword() {
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var passwordLength = 12;
		var password = '';
		for (var i = 0; i < passwordLength; i++) {
			const index = Math.floor(Math.random() * chars.length);
			password += chars[index];
		}
		return password;
	}

	// [POST] /api/auth/register [id, type]
	async register(req, res, next) {
		const { id, type } = req.body;
		// Check if id exists in University of Science
		const inforOfUserFromUS = await User.findUSOne('id', id);

		if (!!inforOfUserFromUS) {
			const isExisting = await User.findOne('id', id);

			if (!isExisting) {
				const password = AuthenController.generatePassword();
				try {
					const transporter = await createTransporter();
					await transporter.sendMail({
						to: `${id}@student.hcmus.edu.vn`,
						subject: 'Kích hoạt tài khoản',
						html: `<h2>Chúc mừng, bạn đã kích hoạt hành công</h2>\n<h3>Mật khẩu là: </h3> ${password} \n<p>Hãy dùng nó để đăng nhập!</p>`,
					});

					const salt = await bcrypt.genSaltSync(10);
					const hash = await bcrypt.hashSync(password, salt);
					const currentDate = new Date();
					const data = {
						id: id,
						name: inforOfUserFromUS.name,
						password: hash,
						type: type,
						typeOfReader: 'DocGiaA',
						birthday: inforOfUserFromUS.birthday,
						address: inforOfUserFromUS.address,
						email: inforOfUserFromUS.email,
						createAt: `${
							currentDate.getDate() < 10
								? '0' + currentDate.getDate()
								: currentDate.getDate()
						}/${
							currentDate.getMonth() + 1 < 10
								? '0' + (currentDate.getMonth() + 1)
								: currentDate.getMonth() + 1
						}/${currentDate.getFullYear()}`,
					};

					await User.createOne(data);

					return res.json({
						msg: 'Đăng ký thành công',
						status: 201,
						result: true,
					});
				} catch (er) {
					console.log(er);
				}
			} else {
				return res.json({
					msg: 'Mã số đã được đăng ký. Hãy quên mật khẩu để lấy lại!',
					status: 200,
					result: false,
				});
			}
		} else {
			return res.json({
				msg: 'Mã số không tồn tại. Vui lòng nhập chính xác mã!',
				status: 200,
				result: false,
			});
		}
	}

	// [POST] /api/auth/login [id, password]
	async login(req, res, next) {
		let existingUser = await User.findOne('id', req.body.id);

		if (!existingUser)
			return res.json({
				msg: 'Mã số chưa đăng ký',
				msgEnglish: 'The code number is not registered!',
				result: false,
			});
		let result = await bcrypt.compareSync(req.body.password, existingUser.password);

		if (result) {
			const accessToken = jwt.sign({ id: req.body.id }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '15m',
			});

			const refreshToken = jwt.sign({ id: req.body.id }, process.env.REFRESH_TOKEN_SECRET);
			await RefreshToken.create({ token: refreshToken });

			res.cookie('access_token', accessToken, {
				maxAge: 1000 * 60 * 15,
				httpOnly: true,
			});

			return res.json({ result: true, refreshToken });
		} else
			return res.json({
				msg: 'Mật khẩu không chính xác',
				status: false,
			});
	}

	// // [POST] /api/auth/refresh-token [id, refreshToken]
	async refreshToken(req, res) {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) return res.sendStatus(401);

		const result = await RefreshToken.findOne(refreshToken);
		if (!result) return res.sendStatus(403);

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
			if (err) return res.sendStatus(403);

			const accessToken = jwt.sign({ id: req.body.id }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '15m',
			});

			res.cookie('access_token', accessToken, {
				maxAge: 1000 * 60 * 15,
				httpOnly: true,
			});

			return res.json({
				result: true,
			});
		});
	}

	// [POST] /api/auth/log-out [refresh_token]
	async logOut(req, res) {
		const refreshToken = req.body.refresh_token;

		if (!refreshToken) return res.sendStatus(401);

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
			if (err) res.sendStatus(403); //Forbidden
			try {
				await RefreshToken.deleteOne('token', refreshToken);
				return res.json({ status: 200, result: true });
			} catch (er) {
				console.log(er);
				return res.json({ status: 200, result: false });
			}
		});
	}

	// [POST] /api/auth/change-password [id, current_password, new_password]
	async changePassword(req, res) {
		const inforOfUser = await User.findOne('id', req.body.id);
		if (!inforOfUser) {
			return res.json({ msg: 'ID không chính xác', status: 200 });
		}
		let result = await bcrypt.compareSync(req.body.current_password, inforOfUser.password);

		if (result) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(req.body.new_password, salt);

			await User.updateOne(req.body.id, {
				password: hash,
			});

			return res.json({ msg: 'Thay đổi mật khẩu thành công', status: 200, result: true });
		} else {
			return res.json({ msg: 'Mật khẩu cũ không chính xác', status: 200, result: true });
		}
	}
}

module.exports = new AuthenController();
