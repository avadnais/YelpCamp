const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//  https://res.cloudinary.com/ddqlv8y7n/image/upload/w_100/v1660350897/YelpCamp/c2_t6h6tz.jpg

const ImageSchema = new Schema({
	url: String,
	filename: String
});

// not storing -> derived from info we are already storing
ImageSchema.virtual('thumbnail').get(function() {
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	description: String,
	geometry: {
		type: {
			type: String,
			enum: [ 'Point' ],
			required: true
		},
		coordinates: {
			type: [ Number ],
			required: true
		}
	},
	location: String,
	images: [ ImageSchema ],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
	return `
	<div class='d-flex justify-content-center align-items-center flex-column'>
	<img class="mb-2" src=${this.images[0].thumbnail}>
	<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
	
	</div>`
})

//remove all reviews when campground gets deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.remove({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
