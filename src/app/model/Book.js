const { firestore } = require('../../config/db')
const {
	collection,
	addDoc,
	doc,
	getDoc,
	updateDoc,
	deleteDoc,
	getDocs,
} = require('firebase/firestore/lite')

class Book {
	constructor(id, name, genre, photos, author, publishedYear, publisher, importedDate, status) {
		this.id = id || ''
		this.name = name
		this.photos = photos
		this.genre = genre
		this.author = author
		this.publishedYear = publishedYear
		this.publisher = publisher
		this.importedDate = importedDate
		this.status = status
	}

	static bookRef = collection(firestore, 'books')

	// CRUD here!
	static async createOne(data) {
		try {
			await addDoc(this.bookRef, data)
			return true
		} catch (er) {
			return false
		}
	}

	static async updateOne(id, newData) {
		try {
			const docRef = doc(this.bookRef, id)
			await updateDoc(docRef, newData)
		} catch (er) {
			return false
		}
	}

	static async deleteOne(id) {
		try {
			const docRef = doc(this.bookRef, id)
			await deleteDoc(docRef)
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
						isValid = data[key].toLowerCase().includes(filter[key].toLowerCase())
					} else if (type === 'number') {
						isValid = data[key] == filter[key]
					}
				})

				if (isValid) {
					const newBook = new Book(
						doc.id,
						data.name,
						data.genre,
						data.photos,
						data.author,
						data.published_year,
						data.publisher,
						data.imported_date,
						data.status
					)

					console.log(newBook)
					books.push(newBook)
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
				const newBook = new Book(
					doc.id,
					data.name,
					data.genre,
					data.photos,
					data.author,
					data.published_year,
					data.publisher,
					data.imported_date,
					data.status
				)

				books.push(newBook)
			})

			return books
		} catch (er) {
			return null
		}
	}
}

module.exports = Book
