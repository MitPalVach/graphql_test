const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');

// ===========================

const schemaString = readFileSync('./schema.graphql', { encoding: 'utf8' });

const schema = buildSchema(schemaString);

const allBooks = [
	{
		id: '1',
		title: 'Book One',
		description: 'first book',
		author: {
			id: '1',
			firstName: 'Mit',
			lastName: 'Pal'
		}
	},
	{
		id: '2',
		title: 'Book Two',
		description: 'second book',
		author: {
			id: '1',
			firstName: 'Mit',
			lastName: 'Pal'
		}
	}
];

const root = {
	getAllBooks: () => {
		return allBooks;
	},
	getBook: params => {
		return allBooks.find(({ id }) => params.id === id);
	},
	addBook: params => {
		allBooks.push({
			id: allBooks.length + 1,
			...params.book,
			author: {
				id: '1',
				firstName: 'Mit',
				lastName: 'Pal'
			}
		});
		return true;
	}
};

// ===========================

const app = express();

app.use(cors());

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true
	})
);

app.listen(6006);

console.log('Server started on http://localhost:6006/graphql');
