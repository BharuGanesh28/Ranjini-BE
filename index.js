const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 8080;

// configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// connect to MongoDB
mongoose.connect('mongodb+srv://bharuganesh283:qfR2De4CeuT1r9c9@ranjiniportfolio.mlpyqnj.mongodb.net/Ranjini', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// define review schema
const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userImage: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    reviewStar: { type: Number, required: true },
    reviewMessage: { type: String, required: true }
});

const websiteSchema = new mongoose.Schema({
    logoImageURL: { type: String, required: true },
    aboutUs: {
      heading: { type: String, required: true },
      content: { type: String, required: true },
      image: { type: String, required: false }
    },
    pricing: {
      heading: { type: String, required: true },
      plans: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          price: { type: Number, required: true }
        }
      ]
    },
    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    }
  });
  
  const Website = mongoose.model('Website', websiteSchema);
  

// define review model
const Review = mongoose.model('Review', reviewSchema);
const Data = mongoose.model('data',websiteSchema);

// define API routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/data', (req, res) => {
    Website.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

app.get('/reviews', (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

app.post('/reviews', (req, res) => {
    const { userName, userImage, reviewStar, reviewMessage } = req.body;
    const newReview = new Review({ userName, userImage, reviewStar, reviewMessage });

    newReview.save()
        .then(() => res.json('Review added successfully'))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
