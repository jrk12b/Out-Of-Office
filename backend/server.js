const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const ptoRoutes = require('./routes/pto');
const authRoutes = require('./routes/auth'); // Import authRoutes

const app = express();
app.use(express.json());

// Enable CORS for all origins (you can restrict this later for security reasons)
app.use(cors());

mongoose
	.connect('mongodb+srv://justinkurdila:HZKZX2gW2XaLDM6u@cluster0.ja5jx.mongodb.net/pto', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('Error connecting to MongoDB', err));

app.use('/api/pto', ptoRoutes);
app.use('/api/auth', authRoutes); // This now works as expected

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
