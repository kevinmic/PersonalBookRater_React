import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

import App from './App';
import SearchMain from './search/SearchMain';
import AddReviewMain from './addReview/AddReviewMain';

var data = {
  "key1": {
    author: "Aaron, Finley",
    seriesTitle: "Dragon Eye",
    seriesBookNumber: 1,
    title: "Dragon",
    genre: "Fantasy",
    imageUrl: "http://d.gr-assets.com/books/1417024668l/23620393.jpg",
    locationOfBook: "Dons Kindle",
    reviews: [{
      sexRating: "T",
      profanityRating: "B",
      violenceRating: "LV",
      recommendRating: "4",
      reviewDate: "",
      reviewedBy: "Don Dodge",
      review: "Ilsa doesn’t know who she is. She only knows her father left her in the care of a guy named Ram, who teaches her swordsmanship in a butcher shop until the day when it’s safe for her to come home. But it may never be safe, and their enemies are closing in. Ilsa and Ram are being hunted, and they must flee through the dangers that bar them from their homeland.  She is a Dragon but has’t learned that yet.  Some believe those ancient monsters don’t deserve to live.",
    }]
  },
  "key2": {
    author: "Abramson, Traci Hunter",
    title: "Smokescreen",
    genre: "Fiction",
    imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZ9ZtRc4zKk2-u4exKM9m1TLBgu1kjUS_PYf0P5yqNg3n_5Y12",
    locationOfBook: "Audible",
    reviews: [{
      sexRating: "",
      profanityRating: "",
      violenceRating: "",
      recommendRating: "8",
      reviewDate: "",
      reviewedBy: "Don Dodge",
      review: "Taylor a young female artist finds herself in the middle of an intrigue she cant understand;  a man was murdered in her hotel room and even when she gets back to the United States she finds that someone is stalking her.  Her boyfriend Quinn, the leader of a squad of navy Seals tries to unravel the mystery while protecting her against whatever and whoever."
    }]
  },
  "key3": {
    author: "Beery, Catherine",
    seriesTitle: "Facades",
    seriesBookNumber: 2,
    title: "Defender of the Empire",
    genre: "",
    imageUrl: "http://ecx.images-amazon.com/images/I/51RjCiygDjL._SX310_BO1,204,203,200_.jpg",
    locationOfBook: "Kindle",
    reviews: [{
      sexRating: "T",
      profanityRating: "B",
      violenceRating: "FV",
      recommendRating: "8",
      reviewDate: "",
      reviewedBy: "Don Dodge",
      review: "My name is Rylynn Sinclair, and I have survived the Admiral’s Challenge and my first month at the Legion Fleet Academy. I was even made a crewman, along with my friends, stationed on the Hail Mary.  Then my past caught up with me.  It all started with Ace showing up in my room talking with my roommate, and the letter he had. From that point on, everything in my life started to pull me back to Colony Lenti and the secrets that surrounded it."
    }]
  },
  "key4": {
    author: "Sanderson, Brandon",
    seriesTitle: "Alcatraz",
    seriesBookNumber: 1,
    title: "Alcatraz Versus the Evil Librarians",
    genre: "Junior Fiction",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d2/Alcatraz_vs_evil_librarians_book_cover.jpg",
    locationOfBook: "Kindle",
    reviews: [
    ]
  }
}

var SearchMainWrapper = React.createClass({
  render: function() {
    return <SearchMain data={data}/>
  }
});

var key = 5;
var AddReviewMainWrapper = React.createClass({
  getInitialState: function() {
    return {data: data};
  },
  addReview: function(book, review) {
    key = key+1;
    book.reviews = [review];
    var newData = this.state.data;
    console.log(this.state);
    newData["key" + key] = book;
    this.setState(newData);
  },
  render: function() {
    return <AddReviewMain addReview={this.addReview}/>
  }
});

var Routes = React.createClass({

  render: function() {
    return (
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMainWrapper}/>
          <Route path="review/search" component={SearchMainWrapper}/>
          <Route path="review/new" component={AddReviewMainWrapper}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
