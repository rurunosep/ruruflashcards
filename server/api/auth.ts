import express from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import passport from 'passport';
import mongo from '../modules/db.js';
import { IUser } from '../types.js';

const router = express.Router();

// POST api/auth/login
// Authenticate user of current session
// body: {username, password}
router.post('/login', (req, res) => {
  passport.authenticate('local', (err: any, user: IUser | false) => {
    if (!user) {
      res.status(401).send('Invalid username or password');
      return;
    }

    req.logIn(user, () => {
      res.send(`Successfully logged in ${user.username}`);
    });
  })(req, res);
});

// GET api/auth/user
// Get authenticated user of current session
router.get('/user', (req, res) => {
  res.send(req.user ? req.user.username : null);
});

// POST api/auth/register
// Register a new user
// body: {username, password}
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send();
    return;
  }
  if (!mongo.isConnected) {
    res.status(500).send('Mongo error');
    return;
  }

  if (await mongo.db('ruruflashcards').collection('users').findOne({ username })) {
    res.status(400).send('User already exists');
    return;
  }

  const defaultCards = [
    { front: 'chatte', back: 'cat' },
    { front: 'chienne', back: 'dog' },
    { front: 'poisson', back: 'fish' },
    { front: 'oiseau', back: 'bird' },
    { front: 'papillon', back: 'butterfly' },
  ];

  const { insertedIds: defaultCardIds } = await mongo
    .db('ruruflashcards')
    .collection('cards')
    .insertMany(defaultCards);

  const { insertedId: defaultDeckId } = await mongo
    .db('ruruflashcards')
    .collection('decks')
    .insertOne({
      name: 'Default',
      card_ids: Object.values(defaultCardIds).map((val) => new ObjectId(val)),
    });

  const salt = await bcrypt.genSalt();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const password_hash = await bcrypt.hash(password, salt);

  const user = { username, password_hash, deck_ids: [defaultDeckId] };
  await mongo.db('ruruflashcards').collection('users').insertOne(user);

  req.logIn(user, () => {
    res.send(`Successfully registered ${username}`);
  });
});

// GET api/auth/logout
// Logout user of current session
router.get('/logout', (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(200).send('No user logged in.');
    return;
  }

  // req.logout isn't working for some reason. The callback is never
  // called, and the session is never destroyed.
  req.user = undefined;
  req.session.destroy(() => {});

  res.status(200).send(`Logged out ${user.username}`);
});

// TODO: endpoint to delete user and child decks and cards

export default router;
