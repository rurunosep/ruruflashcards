import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { ObjectId } from 'mongodb';
import mongo from '../modules/db';

const gql = String.raw;

const schema = buildSchema(gql`
  type User {
    _id: ID!
    username: String!
    password_hash: String!
    decks: [Deck]
  }

  type Deck {
    _id: ID!
    name: String
    cards: [Card]
  }

  type Card {
    _id: ID!
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
    edit_card(_id: ID!, front: String, back: String): Card

    """
    Delete a card in the first deck of the current user
    """
    delete_card(_id: ID!): Card
  }
`);

const resolvers = {
  // Get all the cards for the first deck of the current user
  cards: async (args: any, req: Express.Request) => {
    if (!mongo.isConnected) throw new Error('Mongo error');
    if (!req.user) throw new Error('No user logged in');

    // Get deck
    const deck = await mongo
      .db('ruruflashcards')
      .collection('decks')
      .findOne({ _id: req.user.deck_ids[0] });

    // Get cards referenced by deck
    const cards = await mongo
      .db('ruruflashcards')
      .collection('cards')
      .find({ _id: { $in: deck.card_ids } })
      .toArray();

    return cards;
  },

  // Add a card to the first deck of the current user
  add_card: async (args: any, req: Express.Request) => {
    const { front, back } = args;

    if (!mongo.isConnected) throw new Error('Mongo error');
    if (!req.user) throw new Error('No user logged in');

    const card = { front, back };

    // Insert new card into collection
    const { insertedId: cardId } = await mongo
      .db('ruruflashcards')
      .collection('cards')
      .insertOne(card);

    // Add card to deck's card list
    await mongo
      .db('ruruflashcards')
      .collection('decks')
      .updateOne({ _id: req.user.deck_ids[0] }, { $push: { card_ids: new ObjectId(cardId) } });

    return { _id: cardId, ...card };
  },

  // Edit a card in the first deck of the current user
  edit_card: async (args: any, req: Express.Request) => {
    const { _id: cardId, front, back } = args;

    if (!mongo.isConnected) throw new Error('Mongo error');
    if (!req.user) throw new Error('No user logged in');

    const changes: any = {};
    if (typeof front === 'string') changes.front = front;
    if (typeof back === 'string') changes.back = back;

    // Check that card is in deck
    const deck = await mongo
      .db('ruruflashcards')
      .collection('decks')
      .findOne({
        _id: req.user.deck_ids[0],
        card_ids: { $elemMatch: { $eq: new ObjectId(cardId) } },
      });
    if (!deck) throw new Error(`User does not own card of id: ${cardId}`);

    // Update card
    const { value: card } = await mongo
      .db('ruruflashcards')
      .collection('cards')
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: changes },
        { returnOriginal: false },
      );

    return card;
  },

  // Delete a card in the first deck of the current user
  delete_card: async (args: any, req: Express.Request) => {
    const { _id: cardId } = args;

    if (!mongo.isConnected) throw new Error('Mongo error');
    if (!req.user) throw new Error('No user logged in');

    // Check that card is in deck
    const deck = await mongo
      .db('ruruflashcards')
      .collection('decks')
      .findOne({
        _id: req.user.deck_ids[0],
        card_ids: { $elemMatch: { $eq: new ObjectId(cardId) } },
      });
    if (!deck) throw new Error(`User does not own card of id: ${cardId}`);

    // Remove card from deck's card list
    await mongo
      .db('ruruflashcards')
      .collection('decks')
      .updateOne({ _id: req.user.deck_ids[0] }, { $pull: { card_ids: new ObjectId(cardId) } });

    // Delete card
    const { value: card } = await mongo
      .db('ruruflashcards')
      .collection('cards')
      .findOneAndDelete({ _id: new ObjectId(cardId) });

    return card;
  },
};

export default graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
});
