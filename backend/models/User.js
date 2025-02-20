const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Defining the schema for the 'User' collection in MongoDB
const userSchema = new mongoose.Schema({
	// Username of the user (required field and must be unique)
	username: {
		type: String,
		required: true,
		unique: true,
	},

	// Password of the user (required field)
	password: {
		type: String,
		required: true,
	},
});

// Middleware to hash the password before saving the user document
userSchema.pre('save', async function (next) {
	// If the password hasn't been modified, skip the hashing process
	if (!this.isModified('password')) return next();

	// Generate a salt for hashing the password
	const salt = await bcrypt.genSalt(10);

	// Hash the password using the salt and store it in the password field
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

module.exports = mongoose.model('User', userSchema);
