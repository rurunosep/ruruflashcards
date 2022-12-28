import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, InMemoryCache, gql } from '@apollo/client'
import App from './components/App'
import 'papercss/dist/paper.min.css'
import './style.css'

const apolloClient = new ApolloClient({
	uri: '/graphql',
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={apolloClient}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
)
