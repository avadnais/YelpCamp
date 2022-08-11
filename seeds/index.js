const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, images } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const camp = new Campground({
			author: '62f04e580640bc0d3c9a6669',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: sample(images),
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quisque non tellus orci ac auctor augue mauris augue neque. Tortor id aliquet lectus proin. Faucibus turpis in eu mi bibendum neque egestas. Sed libero enim sed faucibus turpis in eu. Eget nullam non nisi est sit. Vestibulum mattis ullamcorper velit sed ullamcorper morbi. Arcu risus quis varius quam. Consectetur a erat nam at lectus urna duis. Arcu dictum varius duis at consectetur lorem donec massa.',
			price: Math.floor(Math.random() * 20) + 10
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
