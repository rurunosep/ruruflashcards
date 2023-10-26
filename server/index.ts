import './modules/env.js'
import express from 'express'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import connectMongo from 'connect-mongo'
import mongo from './modules/db.js'
import graphqlRoute from './api/graphql.js'
import ttsRoute from './api/tts.js'
import cardsRoute from './api/cards.js'
import authRoute from './api/auth.js'

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')))

// Session
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		store: new (connectMongo(session))({ client: mongo }),
		resave: false,
		saveUninitialized: true,
	})
)

// Passport
import('./modules/passport.js')
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/graphql', graphqlRoute)
app.use('/api/tts', ttsRoute)
app.use('/api/cards', cardsRoute)
app.use('/api/auth', authRoute)

// Start server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started on port ${port}`))
