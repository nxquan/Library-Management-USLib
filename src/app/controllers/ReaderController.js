
const { Reader, Regulation } = require('../model');

class ReaderController {
	static checkAge(birthday, condittion) {
		const currentDate = new Date();
		const parts = birthday.split('/');
		const formattedBirthday = `${parts[2]}-${parts[1]}-${parts[0]}`;
		const birthDate = new Date(formattedBirthday);

		// Lấy số năm và tháng từ ngày sinh
		const birthYear = birthDate.getFullYear();
		const birthMonth = birthDate.getMonth();

		// Lấy số năm và tháng từ ngày hiện tại
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();

		// Tính toán tuổi
		let age = currentYear - birthYear;

		// Kiểm tra xem ngày sinh có diễn ra sau ngày hiện tại trong cùng năm và tháng không
		if (
			currentMonth < birthMonth ||
			(currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())
		) {
			age--;
		}

		if (age <= condittion) return true;
		else return false;
	}

	// [POST] /api/reader
	async createReader(req, res) {
		const data = req.body;
		//check exsist reader

		const reader = await Reader.findOne(data.student_id);
		if (reader !== false && reader !== undefined) {
			return res.json({
				msg: 'Mã số này đã được tạo thẻ độc giả trước đó!',
				status: 201,
				result: false,
			});
		}
		//check age
		const conditionMaxAge = await Regulation.findWithCondition('name', 'max_age');
		const conditionMinAge = await Regulation.findWithCondition('name', 'min_age');

		const checkMaxBirthday = ReaderController.checkAge(
			data.birthday,
			conditionMaxAge[0].current_value,
		);
		const checkMinBirthday = !ReaderController.checkAge(
			data.birthday,
			conditionMinAge[0].current_value,
		);
		if (checkMaxBirthday && checkMinBirthday) {
			try {
				const createReader = await Reader.createOne(data);
				if (createReader)
					return res.json({
						msg: 'Lập thẻ độc giả thành công!',
						status: 201,
						result: true,
					});
				else
					return res.json({
						msg: 'Lập thẻ độc giả thất bại! Vui lòng thử lại.',
						status: 201,
						result: false,
					});
			} catch (er) {
				return res.json({
					msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
					status: 500,
					result: false,
				});
			}
		} else
			return res.json({
				msg: `Vui lòng kiểm tra tuổi trong khoảng [${conditionMinAge[0].current_value},${conditionMaxAge[0].current_value}]`,
				status: 200,
				result: false,
			});
	}

	// [PATCH] /api/reader/:id
	async updateReader(req, res) {
		const id = req.params.id;
		const newData = req.body;

		if (newData.birthday !== undefined) {
			//check age
			const conditionMaxAge = await Regulation.findWithCondition('name', 'max_age');
			const conditionMinAge = await Regulation.findWithCondition('name', 'min_age');

			const checkMaxBirthday = ReaderController.checkAge(
				newData.birthday,
				conditionMaxAge[0].current_value,
			);
			const checkMinBirthday = !ReaderController.checkAge(
				newData.birthday,
				conditionMinAge[0].current_value,
			);
			if (!(checkMinBirthday && checkMaxBirthday))
				return res.json({
					msg: `Vui lòng kiểm tra tuổi trong khoảng [${conditionMinAge[0].current_value},${conditionMaxAge[0].current_value}]`,
					status: 200,
					result: false,
				});
		}
		try {
			const updateReader = await Reader.updateOne(id, newData);
			if (updateReader)
				return res.json({
					msg: 'Cập nhật thẻ độc giả thành công!',
					status: 201,
					result: true,
				});
			else
				return res.json({
					msg: 'Cập nhật thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 201,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [DELETE] /api/reader/:id
	async deleteReader(req, res) {
		const id = req.params.id;
		try {
			const result = await Reader.deleteOne(id);
			if (result)
				return res.json({
					msg: 'Xoá thẻ độc giả thành công!',
					status: 204,
					result: true,
				});
			else
				return res.json({
					msg: 'Xoá thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 204,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader/:id
	async findOneReader(req, res) {
		const id = req.body.id;

		try {
			const reader = await Reader.findOne(id);

			if (reader !== undefined)
				return res.json({
					reader: reader,
					status: 200,
					result: true,
				});
			else
				return res.json({
					msg: 'Không tìm thấy độc giả này!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader
	async getAllReader(req, res) {
		try {
			const result = await Reader.getAll();
			if (result !== null) {
				return res.json({
					readers: result,
					status: 200,
					result: true,
				});
			} else
				return res.json({
					msg: 'Có lỗi xảy ra, vui lòng thử lại!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader/search
	async search(req, res) {
		const filter = req.query;

		try {
			const reader = await Reader.findSome(filter);

			if (reader !== null) {
				return res.json({
					readers: reader,
					status: 200,
					result: true,
				});
			} else
				return res.json({
					msg: 'Không tìm thấy độc giả nào!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}
}

module.exports = new ReaderController();
