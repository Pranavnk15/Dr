const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

// EJS setup
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.set('views', './views');
// Set up session middleware
app.use(session({
    secret: 'mySecret', // Change this to a secure value in production
    resave: false,
    saveUninitialized: false
  }));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/drDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
    content: String
  };

const User = mongoose.model('User', userSchema);
const Post = mongoose.model("Post", postSchema);


// Serve HTML for the form
app.get('/', (req, res) => {
    res.render('index');
});
// Handle form submission
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
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving user to MongoDB: ' + err.message);
        res.status(500).send('Error submitting form');
    }
});

// Admin portal to view data
app.get('/admin', (req, res) => {
    User.find({}).sort({ _id: -1 }).exec()
        .then(users => {
            res.render('admin', { users: users }); // Assuming 'admin.ejs' is your EJS file for the admin view
        })
        .catch(err => {
            console.error('Error fetching users from MongoDB: ' + err.message);
            res.status(500).send('Error retrieving data');
        });
});

// Delete route for individual user
app.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndRemove(userId);
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

  app.post("/compose", async function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    try {
        await post.save();
        res.redirect("/blog");
    } catch (err) {
        console.error('Error saving post to MongoDB: ' + err.message);
        res.status(500).send('Error composing post');
    }
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

app.get("/posts/:postId", async function(req, res) {
    try {
        const requestedPostId = req.params.postId;
        const post = await Post.findOne({ _id: requestedPostId }).exec();

        if (!post) {
            console.log('Post not found');
            res.redirect("/");
        } else {
            res.render("post", {
                title: post.title,
                content: post.content
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
  
  
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
