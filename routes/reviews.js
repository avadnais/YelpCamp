const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {reviewSchema} = require('../schemas.js')

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review')

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//Review routes
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete('/:reviewId', catchAsync(async(req, res) => {
	await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}})
	await Review.findByIdAndDelete(req.params.reviewId);
	res.redirect(`/campgrounds/${req.params.id}`)
}))

module.exports = router;