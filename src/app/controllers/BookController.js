const {Book} = require('../model');

const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const storage = getStorage();

const { bookSchema } = require('../../config/validate');

class BookController {
	// [POST] /api/book
	async createBook(req, res) {
		const data = req.body;
		const { value, error } = bookSchema.validate(data);

		// validate the format of data
		if (error) {
			return res.json({ error: error.details[0].message });
		}

		const photos = []

		await Promise.all(
			Array.from(req.files).map(async (file) => {
				const storageRef = ref(storage, `photos/${file.originalname}`)
				const snap = await uploadBytes(storageRef, file.buffer)
				const url = await getDownloadURL(snap.ref)
				photos.push(url)
			})
		)

		try {
			await Book.createOne({
				...data,
				photos: photos,
			})

			return res.json({ msg: 'Tạo thành công!', status: 200, result: true });
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Hãy thử lại sau.',
				status: 200,
				result: false,
			})
		}
	}

	// [PATCH] /api/book/:id
	async updateBook(req, res) {
		const id = req.params.id
		const data = req.body
		const isChangingPhoto = req.body?.is_changeing_photo
		delete data?.is_changeing_photo

		const photos = []
		// Check whether or not User is changing photos of book
		if (isChangingPhoto) {
			const files = req.files

			// Delete all photos in storage now
			const oldPhotosURL = docData.photos
			await Promise.all(
				Array.from(oldPhotosURL).map(async (url) => {
					let pictureRef = ref(storage, url)
					await deleteObject(pictureRef)
				})
			)

			// Create new photos
			await Promise.all(
				Array.from(files).map(async (file) => {
					const storageRef = ref(storage, `photos/${file.originalname}`)
					const snap = await uploadBytes(storageRef, file.buffer)
					const url = await getDownloadURL(snap.ref)
					photos.push(url)
				})
			)
		}

		try {
			await Book.updateOne(id, data);
			return res.json({ msg: 'Cập nhật thành công!', status: 200, result: true });
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Hãy thử lại sau.',
				status: 200,
				result: false,
			})
		}
	}

	// [DELETE] /api/book/:id
	async deleteBook(req, res) {
		const id = req.params.id

		try {
			const result = await Book.deleteOne(id);
			if (result) {
				return res.json({ msg: 'Xóa thành công!', status: 204, result: true });
			} else {
				return res.json({
					msg: 'Không tim thấy độc giả để xóa',
					status: 204,
					result: false,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Hãy thử lại sau.',
				status: 500,
				result: false,
			})
		}
	}

	// [GET] /api/book
	async getAll(req, res) {
		const books = await Book.findAll()

		return res.json({
			data: {
				books,
			},
			status: 200,
			result: true,
		})
	}

	// [GET] /api/book/:id
	async getOne(req, res) {
		const book = await Book.findOne(req.params.id);
		if (!book) {
			return res.json({
				data: 'Không tin thấy sách này!',
				status: 200,
				result: false,
			});
		} else {
			return res.json({
				data: {
					book,
				},
				status: 200,
				result: true,
			});
		}
	}

	// [GET] /api/book/search
	async search(req, res) {
		const filter = req.query

		try {
			const result = await Book.findSome(filter)

			return res.json({
				data: {
					books: result,
					size: result.length,
					result: true,
					status: 200,
				},
			})
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Hãy thử lại sau.',
				result: false,
				status: 500,
			});
		}
	}

	// [POST] api/book/reserve
}

module.exports = new BookController()
