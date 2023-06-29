const { serverTimestamp, setDoc } = require('firebase/firestore/lite')
const { firestore } = require('../../config/db')

const {
	collection,
	doc,
	getDoc,
	updateDoc,
	deleteDoc,
	getDocs,
} = require('firebase/firestore/lite')

class Book {
	constructor(
		id,
		name,
		genre,
		photos,
		author,
		publishedYear,
		publisher,
		importedDate,
		status,
		number
	) {
		this.id = id || ''
		this.name = name
		this.photos = photos
		this.genre = genre
		this.author = author
		this.publishedYear = publishedYear
		this.publisher = publisher
		this.importedDate = importedDate
		this.status = status
		this.number = number
	}

	static bookRef = collection(firestore, 'books')

	// CRUD here!
	static async createOne(data) {
		const id = data.id
		delete data.id
		const document = {
			...data,
			created_at: serverTimestamp(),
			updated_at: serverTimestamp(),
		}

		try {
			const newDocRef = doc(this.bookRef, id)
			await setDoc(newDocRef, document)
			return true
		} catch (er) {
			return false
		}
	}

	static async updateOne(id, newData) {
		const document = {
			...newData,
			updated_at: serverTimestamp(),
		}

		try {
			const docRef = doc(this.bookRef, id)
			await updateDoc(docRef, document)
		} catch (er) {
			return false
		}
	}

	static async deleteOne(id) {
		try {
			const docRef = doc(this.bookRef, id)
			await deleteDoc(docRef)
			return true
		} catch (er) {
			return false
		}
	}

	static async findOne(id) {
		try {
			const docRef = doc(this.bookRef, id)
			const snapDoc = await getDoc(docRef)
			return snapDoc.data()
		} catch (er) {
			return null
		}
	}

	static unicodeToASCII(str) {
		// Chuyển hết sang chữ thường
		str = str.toLowerCase()

		// xóa dấu
		str = str
			.normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
			.replace(/[\u0300-\u036f]/g, '') // xóa các ký tự dấu sau khi tách tổ hợp

		// Thay ký tự đĐ
		str = str.replace(/[đĐ]/g, 'd')

		// Xóa ký tự đặc biệt
		str = str.replace(/([^0-9a-z-\s])/g, '')

		// Xóa khoảng trắng thay bằng ký tự -
		str = str.replace(/(\s+)/g, '-')

		// Xóa ký tự - liên tiếp
		str = str.replace(/-+/g, '-')

		// xóa phần dư - ở đầu & cuối
		str = str.replace(/^-+|-+$/g, '')

		// return
		return str
	}

	static async findSome(filter = {}) {
		try {
			const snapDocs = await getDocs(this.bookRef)
			const books = []

			snapDocs.forEach((doc) => {
				const data = doc.data()
				let isValid = true

				Object.keys(filter).forEach((key) => {
					const type = typeof filter[key]
					if (isValid == false) return

					if (type === 'string') {
						const left = Book.unicodeToASCII(data[key])
						const right = Book.unicodeToASCII(filter[key])
						isValid = left.includes(right)
					} else if (type === 'number') {
						isValid = data[key] == filter[key]
					}
				})

				if (isValid) {
					data.id = doc.id
					books.push(data)
				}
			})

			return books
		} catch (er) {
			return null
		}
	}

	static async findAll() {
		try {
			const snapDocs = await getDocs(this.bookRef)
			const books = []
			snapDocs.forEach((doc) => {
				const data = doc.data()
				data.id = doc.id
				books.push(data)
			})

			return books
		} catch (er) {
			return null
		}
	}
}

module.exports = Book
