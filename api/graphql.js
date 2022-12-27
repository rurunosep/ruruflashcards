const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
const { ObjectId } = require('mongodb')
const gql = String.raw

const schema = buildSchema(gql`
	type User {
		id: ID!
		username: String!
		password_hash: String!
		decks: [Deck]
	}

	type Deck {
		id: ID!
		name: String
		cards: [Card]
	}

	type Card {
		id: ID!
		front: String
		back: String
	}

	type Query {
		"""
		Get all the cards for the first deck of the current user
		"""
		cards: [Card]
	}

	type Mutation {
		"""
		Add a card to the first deck of the current user
		"""
		add_card(front: String, back: String): Card

		"""
		Edit a card in the first deck of the current user
		"""
		edit_card(id: ID!, front: String, back: String): Card

		"""
		Delete a card in the first deck of the current user
		"""
		delete_card(id: ID!): Card
	}
`)

const resolvers = {
	// Get all the cards for the first deck of the current user
	cards: async (args, req) => {
		const { mongo } = req.locals

		if (!mongo.isConnected) throw new Error('Mongo error')
		if (!req.user) throw new Error('No user logged in')

		// TODO: do this in a single query
		// cards are just going to go inside the deck object anyway

		// Get deck
		const deck = await mongo
			.db('ruruflashcards')
			.collection('decks')
			.findOne({ _id: req.user.deck_ids[0] })

		// Get cards referenced by deck
		const cards = await mongo
			.db('ruruflashcards')
			.collection('cards')
			.find({ _id: { $in: deck.card_ids } })
			.map((card) => ({ id: card._id, ...card }))
			.toArray()

		return cards
	},

	// Add a card to the first deck of the current user
	add_card: async (args, req) => {
		const { mongo } = req.locals
		const { front, back } = args

		if (!mongo.isConnected) throw new Error('Mongo error')
		if (!req.user) throw new Error('No user logged in')

		const card = { front, back }

		// Insert new card into collection
		const { insertedId: cardId } = await mongo
			.db('ruruflashcards')
			.collection('cards')
			.insertOne(card)

		// Add card to deck's card list
		await mongo
			.db('ruruflashcards')
			.collection('decks')
			.updateOne({ _id: req.user.deck_ids[0] }, { $push: { card_ids: ObjectId(cardId) } })

		return { id: cardId, ...card }
	},

	// Edit a card in the first deck of the current user
	edit_card: async (args, req) => {
		const { mongo } = req.locals
		const { id: cardId, front, back } = args

		if (!mongo.isConnected) throw new Error('Mongo error')
		if (!req.user) throw new Error('No user logged in')

		let changes = {}
		if (typeof front === 'string') changes.front = front
		if (typeof back === 'string') changes.back = back

		// Check that card is in deck
		const deck = await mongo
			.db('ruruflashcards')
			.collection('decks')
			.findOne({
				_id: req.user.deck_ids[0],
				card_ids: { $elemMatch: { $eq: ObjectId(cardId) } },
			})
		if (!deck) throw new Error(`User does not own card of id: ${cardId}`)

		// Update card
		const { value: card } = await mongo
			.db('ruruflashcards')
			.collection('cards')
			.findOneAndUpdate({ _id: ObjectId(cardId) }, { $set: changes }, { returnOriginal: false })

		return { id: card._id, ...card }
	},

	// Delete a card in the first deck of the current user
	delete_card: async (args, req) => {
		const { mongo } = req.locals
		const { id: cardId } = args

		if (!mongo.isConnected) throw new Error('Mongo error')
		if (!req.user) throw new Error('No user logged in')

		// Check that card is in deck
		const deck = await mongo
			.db('ruruflashcards')
			.collection('decks')
			.findOne({
				_id: req.user.deck_ids[0],
				card_ids: { $elemMatch: { $eq: ObjectId(cardId) } },
			})
		if (!deck) throw new Error(`User does not own card of id: ${cardId}`)

		// Remove card from deck's card list
		await mongo
			.db('ruruflashcards')
			.collection('decks')
			.updateOne({ _id: req.user.deck_ids[0] }, { $pull: { card_ids: ObjectId(cardId) } })

		// Delete card
		const { value: card } = await mongo
			.db('ruruflashcards')
			.collection('cards')
			.findOneAndDelete({ _id: ObjectId(cardId) })

		return { id: card._id, ...card }
	},
}

module.exports = graphqlHTTP({
	schema,
	rootValue: resolvers,
	graphiql: true,
})
