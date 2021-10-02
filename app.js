const express= require('express');
const mongoose= require('mongoose');
const path = require('path');
const catchError= require('./utilities/catchError');
const expressError= require('./utilities/expressErrors');
const Campground= require('./model/campground');
const Review= require('./model/review');
const User= require('./model/user');

const Joi= require('joi');
const session= require('express-session');
const flash= require('connect-flash');
const {campgroundSchema, reviewSchema}= require('./joiSchema.js');
const campgroundRoutes= require('./routes/campground');
const reviewRoutes= require('./routes/review');
const userRoutes= require('./routes/user');
const passport= require('passport');
const localStrategy= require('passport-local');


//express
const app= express();
app.use(express.urlencoded({extended:true}));
//mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
})
//connecting mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DataBase Connected");
});
//ejs
const ejsMate= require('ejs-mate')
app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
const methodOverride= require('method-override')
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


const sessionconfig= {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+ 1000 * 60* 60*24*7,
        maxAge:1000 * 60* 60*24*7
    }
}
app.use(session(sessionconfig));
app.use(flash());
// this must be written after sessionconfig
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeuser',async(req,res)=>{
//     const user= new User({
//         username: 'kk',
//         email: 'kk@gmail.com'
//     })
//     const newuser= await User.register(user,'chicken');
//     res.send(newuser);
// })
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

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/review', reviewRoutes);
app.use('/', userRoutes);


app.all('*',(req,res,next)=>{
 next(new expressError("page not found", 404))
})
app.use((err,req,res,next)=>{
    const {statusCode= 500}= err;
    if(!err.message){
       err.message= "something is wrong";
    }
    res.status(statusCode).render('error', {err});
})
app.listen(3000,()=>{
    console.log("hii, listening on port 3000")
})