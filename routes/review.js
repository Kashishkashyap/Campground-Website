const express= require('express');
const router = express.Router({ mergeParams: true });
const catchError= require('../utilities/catchError');
const expressError= require('../utilities/expressErrors');
const Campground= require('../model/campground');
const Review= require('../model/review');
const {reviewSchema}= require('../joiSchema.js');
const validateReview= (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
      if(error){
        const msg= error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else{
        next();
    }
}
router.post('/',validateReview, catchError(async(req,res)=>{
    const camp= await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    camp.review.push(review);
    await camp.save();
    await review.save();
    req.flash('success', 'successfully made a new review');
    res.redirect(`/campgrounds/${camp._id}`);

}))
router.delete('/:reviewId', catchError(async(req,res)=>{
    const {id, reviewId}= req.params;
    const camp=await Campground.findByIdAndUpdate(id,{$pull:{review: reviewId}});//pull is used to delete reviews from campground in database
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
    
}))
module.exports= router;