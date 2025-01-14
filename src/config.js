const PORT = process.env.PORT || 8000;
const HOST =
	process.env.NODE_ENV === 'production'
		? 'https://out-of-office-db-437a4905f678.herokuapp.com/'
		: `http://localhost:${PORT}`;
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://justinkurdila:HZKZX2gW2XaLDM6u@cluster0.ja5jx.mongodb.net/pto';

module.exports = {
	HOST,
	PORT,
	MONGODB_URI,
};
