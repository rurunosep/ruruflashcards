import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import mongo from './db.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (!mongo.isConnected) throw new Error('Mongo error');

      const user = await mongo.db('ruruflashcards').collection('users').findOne({ username });
      if (!user) {
        done(null, false);
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        done(null, false);
        return;
      }

      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  if (!mongo.isConnected) {
    done('Mongo error');
    return;
  }
  mongo
    .db('ruruflashcards')
    .collection('users')
    .findOne({ username })
    .then((user) => {
      if (!user) done(null, false);
      done(null, user);
    })
    .catch((err) => done(err));
});
