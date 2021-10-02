const express= require('express');
const router = express.Router();
const catchError= require('../utilities/catchError');
const expressError= require('../utilities/expressErrors');
const Campground= require('../model/campground');
const {campgroundSchema}= require('../joiSchema.js');
const {isloggedin}= require('../middleware');
const validateCampground= (req, res, next) =>{

    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    }
    else{
        next();
    }

}
router.get('/new',isloggedin, (req,res)=>{
    res.render('campgrounds/new');
})
router.post('/',isloggedin,validateCampground, catchError(async (req,res,next) => {
        // if(!req.body.campgrounds)  {
        //     throw new expressError("missing fields", 500);
        // }  
        const newCampground= new Campground(req.body.campground);
        await newCampground.save();
        req.flash('success', 'successfully made a new campground');
        res.redirect(`/campgrounds/${newCampground._id}`);

}))
router.get('/:id', catchError(async (req,res)=>{
    const {id}= req.params;
    const camp= await Campground.findById(id).populate('review');
    if(!camp){
        req.flash('error','cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}))
router.get('/:id/edit',isloggedin, catchError(async (req,res)=>{
    const {id}= req.params;
    const camp=await Campground.findById(id);
    req.flash('success', 'successfully edited campground')
    res.render('campgrounds/edit',{camp})
}))
router.get('/', catchError(async (req,res)=>{
const campgrounds= await Campground.find({});

res.render('campgrounds/index', {campgrounds});
}))

router.put('/:id',isloggedin,validateCampground, catchError(async (req,res)=>{
    const {id}= req.params;
    const camp= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success', 'successfullyupdated the campground');
    res.redirect(`/campgrounds/${camp._id}`);
}))
router.delete('/:id',isloggedin, catchError(async(req,res)=>{
    const {id}= req.params;
    const deletecamp= await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted the campground');
    res.redirect('/campgrounds');
}))
module.exports= router;