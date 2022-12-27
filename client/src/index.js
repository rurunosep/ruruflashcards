import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, InMemoryCache, gql } from '@apollo/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './components/App'
import 'papercss/dist/paper.min.css'
import './style.css'

const apolloClient = new ApolloClient({
	uri: window.location.protocol + '//' + window.location.host + '/api/graphql',
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<Provider store={store}>
		<ApolloClient client={apolloClient}>
			<App />
		</ApolloClient>
	</Provider>,
	document.getElementById('root')
)
