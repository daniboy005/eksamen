const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes')

// Create an instance of the Express.js app
const app = express();


app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine and specify the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
const uri = 'mongodb+srv://danieloh05:n0TAI8h1HDTh64Cg@eksamen.weaitsv.mongodb.net/eksamen';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to the MongoDB database');
  })
  .catch((error) => {
    console.error('Error connecting to the MongoDB database:', error);
  });

// Define a mongoose schema for the user collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  todoList: [
    {
      todo: String
    }
  ]
});

const User = mongoose.model('User', userSchema);

// Create an API endpoint to handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      res.sendStatus(500);
    } else {
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.sendStatus(500);
        } else {
          const user = new User({
            username: username,
            password: hashedPassword,
            todoList: [] // Initialize an empty todo list
          });

          user.save()
            .then(() => {
              console.log('User registered successfully');
              res.sendStatus(200);
            })
            .catch((error) => {
              console.error('Error registering user:', error);
              res.sendStatus(500);
            });
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('username', username);
  console.log('password', password);

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            console.log('User logged in successfully');
            // Render the corresponding todo list based on the logged-in user
            if (user.username === username) {
              if (username === 'daniel') {
                res.render('todo', { todos: user.todoList });
              } else if (username === 'admin') {
                res.render('todo2', { todos: user.todoList });
              } else if (username === 'eksamen') {
                res.render('todo3', { todos: user.todoList });
              }
            } else {
              console.error('Invalid username');
              res.sendStatus(401);
            }
          } else {
            console.error('Invalid password');
            res.sendStatus(401);
          }
        });
      } else {
        console.error('Invalid username');
        res.sendStatus(401);
      }
    })
    .catch((error) => {
      console.error('Error logging in user:', error);
      res.sendStatus(500);
    });
});




// Render the login.ejs file
app.get('/login', (req, res) => {
  res.render('login');
});

// Render the todo.ejs file
app.get('/todo', (req, res) => {
  res.render('todo');
});

// Render the todo2.ejs file
app.get('/todo2', (req, res) => {
  res.render('todo2');
});

// Render the todo3.ejs file
app.get('/todo3', (req, res) => {
  res.render('todo3');
});

// Render the todo3.ejs file
app.get('/veileder', (req, res) => {
  res.render('veileder');
});

// Serve the main.js file
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});



// Render the index.ejs file
app.get('/', (req, res) => {
  res.render('index');
});

//Using the authRoutes
app.use(authRoutes)

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
