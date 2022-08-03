const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	description: String,
	location: String,
	image: String,
	description: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

//remove all reviews when campground gets deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
