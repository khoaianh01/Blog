
    require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const path = require('path');
const { request } = require('http').createServer();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer  = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {storage,cloudinary } = require('./cloudinary/index');
const FacebookStrategy = require('passport-facebook').Strategy;
const {google} = require('googleapis');


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const nodemailer =  require('nodemailer');


const pageBlogs = require('./routes/page_blogs.js');
const homeRoutes = require('./routes/blogs.js');
const Blog = require('./models/blogs.js');
const Topic = require('./models/topics.js');
const User = require('./models/users');
const userRoutes = require('./routes/users.js');
const adminRoutes = require('./routes/admin_blogs.js');
const sendMail = require('./routes/sendMail.js');
const ExpressError = require('./utils/ExpressError');



const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
var MongoDBStore = require('connect-mongodb-session')(session);

const clientID = process.env.CLIENT_ID ;
const clientSecret =  process.env.CLIENT_SECRET;
const callbackURL =  process.env.callbackURL;

const dbUrl =  process.env.DB_URL;
const secret = process.env.SECRET;
const parser = multer({ storage: storage });


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
const store = new MongoDBStore({
    uri: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

app.use(session({
    secret,
    resave: false,
  store:store,
    saveUninitialized: true,
    // cookie: { secure: true }
}));
// app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.use(new GoogleStrategy(
    {
    clientID,
    clientSecret,
    callbackURL
},
function (token, refreshToken, profile, done) {
    process.nextTick(function () {

        // // tìm trong db xem có user nào đã sử dụng google id này chưa
        User.findOne({'googleId': profile.id}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
               
                // if a user is found, log them in
                return done(null, user);
            } else {
                // if the user isnt in our database, create a new user
                var newUser = new User();

                // set all of the relevant information
          
                newUser.email = profile.emails[0].value; // pull the first email
                console.log(newUser);
                // save the user
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });

}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {  
    next();
})



app.get('/auth/google',
  passport.authenticate('google',{ scope: 'email' }),(req, res)=>{
      console.log('loi')
  });
  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }));



app.get('/list',(req,res)=>{
    res.render('admins/addimage');
})
app.post('/list',parser.array('avata1'),async (req,res)=>{
    const fileUrls = req.files.map((f)=>({url:f.filename}));
    const topics = await Topic.find({});
    res.render('admins/addpost',{topics,fileUrls})

})
app.post('/admin/upload',multipartMiddleware,(req,res) =>{
    try {
       
         
                 
        let fileName = req.files.upload.name;
        let url = '/images/'+fileName;                    
        let msg = 'Upload successfully';
        let funcNum = req.query.CKEditorFuncNum;
        console.log(req.files);
       
        res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
    }

catch (error) {
console.log(error.message);
}
})
app.use('/home',homeRoutes);
app.use('/home',pageBlogs);
app.use('/admin',userRoutes);
app.use('/admin',adminRoutes);
app.use('/send',sendMail);

app.all('*', (req,res,next) => {
    next(new ExpressError(404,'Page Not Found'));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Oh No, Something Went Wrong!';
    }
    res.status(statusCode).render('error', {err});
})
const port = process.env.PORT ||'3000';
app.listen(port,(req,res)=>{
    console.log(`da ket noi ${port}`)
})
