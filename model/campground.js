const mongoose= require('mongoose');
const Review = require('./review')
const Schema= mongoose.Schema;
const CampgroundSchema= new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location:String,
    review:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})
module.exports= mongoose.model('Campground', CampgroundSchema);