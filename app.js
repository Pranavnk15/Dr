const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
var dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const app = express();
const homeStartingContent = "Welcome to Dr. Pradeep Makasare's dental blog, a space dedicated to enhancing your oral health and bringing you the latest insights in modern dentistry. Our team is passionate about not just creating beautiful smiles, but also ensuring the overall wellness of our patients. From tips for maintaining optimal oral hygiene to demystifying common dental procedures, we're here to empower you with knowledge and guidance on your journey to a healthier, happier smile.";

// EJS setup
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.set('views', './views');

// Set up session middleware
app.use(session({
    secret: 'mySecret', // Change this to a secure value in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Session max age in milliseconds (e.g., 1 day)
    }
}));
  
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB: ' + err.message);
});

// MongoDB Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    comments: String
});

const postSchema = {
    title: String,
    content: String,
    imagePath: String // Add imagePath field for storing image paths
};
const User = mongoose.model('User', userSchema);
const Post = mongoose.model("Post", postSchema);


// Serve HTML for the form
app.get('/', (req, res) => {
    res.render('index');
});// Handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, phone, comments } = req.body;

    // Create a new user document
    const newUser = new User({
        name,
        email,
        phone,
        comments
    });

    try {
        // Save user to the database
        await newUser.save();
        console.log('User saved to MongoDB');
        // Send an alert script for successful submission
        res.send(`
            <script>
                alert('Form submitted successfully!');
                window.location.href = '/'; // Redirect to home or another page
            </script>
        `);
    } catch (err) {
        console.error('Error saving user to MongoDB: ' + err.message);
        // Send an alert script for form submission error
        res.status(500).send(`
            <script>
                alert('Error submitting form');
                window.location.href = '/'; // Redirect to home or another page
            </script>
        `);
    }
});


// Admin portal to view data
app.get('/admin', (req, res) => {
    if (req.session.authenticated) {
        User.find({}).sort({ _id: -1 }).exec()
        .then(users => {
            res.render('admin', { users: users }); // Assuming 'admin.ejs' is your EJS file for the admin view
        })
        .catch(err => {
            console.error('Error fetching users from MongoDB: ' + err.message);
            res.status(500).send('Error retrieving data');
    });
    } else {
        res.redirect('/login');
    }
   
});

// Delete route for individual user
app.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting user from MongoDB: ' + err.message);
        res.status(500).send('Error deleting user');
    }
});

// Delete route for multiple users
app.post('/delete', async (req, res) => {
    const userIds = req.body.deleteUser;
    try {
        await User.deleteMany({ _id: { $in: userIds } });
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting users from MongoDB: ' + err.message);
        res.status(500).send('Error deleting users');
    }
});
app.get("/blog", async function(req, res) {
    try {
        const posts = await Post.find({}).exec();
        res.render("blog", {
            startingContent: homeStartingContent,
            posts: posts
        });
    } catch (err) {
        console.error('Error fetching posts from MongoDB: ' + err.message);
        res.status(500).send('Error retrieving blog posts');
    }
});

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Destination folder for uploaded images
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename for the uploaded image
    }
  });

  const upload = multer({ storage: storage });

// Route handling image upload and form submission
// Previous code for saving posts with image uploads
app.post('/compose', upload.single('postImage'), async function(req, res) {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      // Assuming 'postImage' is the name attribute in the form for the uploaded image
      imagePath: req.file ? `/uploads/${req.file.filename}` : null // Save the image path in your database
      // Add 'imagePath' property in your Post schema accordingly
    });
  
    try {
      await post.save();
      res.redirect("/blog");
    } catch (err) {
      console.error('Error saving post to MongoDB: ' + err.message);
      res.status(500).send('Error composing post');
    }
  });
  
  // Route to render the compose page with blog list for deletion
  app.get('/compose', async (req, res) => {
    try {
      const blogs = await Post.find({}, 'title _id').exec(); // Retrieve blog titles and IDs
      res.render('compose', { blogs: blogs });
    } catch (err) {
      console.error('Error retrieving blog list:', err);
      res.status(500).send('Error retrieving blog list');
    }
  });
  
  // Route to handle deletion of individual blog posts
  app.post('/delete/:id', async (req, res) => {
    const blogId = req.params.id;
    try {
      await Post.findByIdAndDelete(blogId);
      res.redirect('/compose'); // Redirect back to the compose page after deletion
    } catch (err) {
      console.error('Error deleting blog:', err);
      res.status(500).send('Error deleting blog');
    }
  });
  

  app.get("/gallery", function(req, res){
    res.render("gallery");
});


app.get("/compose", function(req, res){
    res.render("compose");
});

app.get("/contact", function(req, res){
    res.render("contactus");
});

app.get("/services", function(req, res){
    res.render("services");
});

app.get("/aboutus", function(req, res){
    res.render("about");
});


// Assuming 'post' contains the data you're sending to the post.ejs file
app.get('/posts/:postId', async function(req, res) {
    try {
        const requestedPostId = req.params.postId;
        const post = await Post.findOne({ _id: requestedPostId }).exec();

        if (!post) {
            console.log('Post not found');
            res.redirect("/");
        } else {
            res.render("post", {
                title: post.title,
                content: post.content,
                imagePath: post.imagePath // Make sure imagePath is retrieved from the database
            });
        }
    } catch (err) {
        console.error('Error finding post from MongoDB: ' + err.message);
        res.status(500).send('Error retrieving post');
    }
});

// Sample route for handling login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Here, you can perform authentication logic, like checking against a database
    // For demonstration purposes, a simple check is shown
  
    if (email === 'admin@gmail.com' && password === '1234') {
      // Set user session (create a basic authenticated session)
      req.session.authenticated = true;
      req.session.user = { email: email }; // Store user details in the session
      res.redirect('/admin'); // Redirect to admin or authenticated page
    } else {
      res.send('Invalid credentials. Please try again.'); // For demonstration purposes, send an error message
    }
  });
  

// Sample route for displaying the login form
app.get('/login', (req, res) => {
    res.render('login'); // Render the login.ejs file
  });
  
  
const PORT = process.env.PORT ||3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
