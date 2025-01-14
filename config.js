const PORT = process.env.PORT || 8000;
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://justinkurdila:HZKZX2gW2XaLDM6u@cluster0.ja5jx.mongodb.net/pto';

module.exports = {
	PORT,
	MONGODB_URI,
};
