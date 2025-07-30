const PORT = process.env.PORT || 8000;
const CORS_ORIGIN =
	process.env.NODE_ENV === 'production'
		? 'https://out-of-office-app-b55595fc51c3.herokuapp.com'
		: `http://localhost:3000`;
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://justinkurdila:HZKZX2gW2XaLDM6u@cluster0.ja5jx.mongodb.net/pto';

const HABITS_MONGODB_URI =
	process.env.HABITS_MONGODB_URI ||
	'mongodb+srv://justinkurdila:YMpla2q9VsVA49T5@cluster1.fdjjmus.mongodb.net/activities';

module.exports = {
	PORT,
	MONGODB_URI,
	HABITS_MONGODB_URI,
	CORS_ORIGIN,
};
