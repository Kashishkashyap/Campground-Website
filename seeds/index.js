const mongoose= require('mongoose');
const cities= require('./cities');
const {descriptors, places}= require('./helper');
const Campground= require('../model/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
})
//connecting mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DataBase Connected");
});

const sample= (array)=>{
  return array[Math.floor(Math.random() * array.length)]
}
const seedDB = async() => {
    await Campground.deleteMany({});
      for(let i=0;i<50;i++){
        const random1000= Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251/200x200",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            price: Math.floor(Math.random() * 20)
          })
        await camp.save();
      }
}
seedDB().then(()=>{
  mongoose.connection.close();
})
