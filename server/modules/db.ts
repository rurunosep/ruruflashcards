import { MongoClient } from 'mongodb'

const mongo = new MongoClient(process.env.MONGODB_URI!, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

mongo
	.connect()
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('Failed to connected to MongoDB'))

export default mongo
