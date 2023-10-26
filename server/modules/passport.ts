import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import mongo from './db.js'

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			if (!mongo.isConnected) throw 'Mongo error'

			const user = await mongo.db('ruruflashcards').collection('users').findOne({ username })
			if (!user) return done(null, false)

			const isMatch = await bcrypt.compare(password, user.password_hash)
			if (!isMatch) return done(null, false)

			return done(null, user)
		} catch (err) {
			done(err)
		}
	})
)

passport.serializeUser((user, done) => {
	done(null, user.username)
})

passport.deserializeUser((username, done) => {
	if (!mongo.isConnected) return done('Mongo error')
	mongo
		.db('ruruflashcards')
		.collection('users')
		.findOne({ username })
		.then((user) => {
			if (!user) return done(null, false)
			return done(null, user)
		})
		.catch((err) => done(err))
})
