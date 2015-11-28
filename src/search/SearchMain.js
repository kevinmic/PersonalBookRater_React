import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';

var data = {
  "key1": {
    author: "Aaron, Finley",
    seriesTitle: "Dragon Eye",
    seriesBookNumber: 1,
    title: "Dragon",
    sexRating: "T",
    profanityRating: "B",
    violenceRating: "LV",
    recommendRating: "4",
    genre: "Fantasy",
    imageUrl: "http://d.gr-assets.com/books/1417024668l/23620393.jpg",
    locationOfBook: "Dons Kindle",
    reviewDate: "",
    review: "Ilsa doesn’t know who she is. She only knows her father left her in the care of a guy named Ram, who teaches her swordsmanship in a butcher shop until the day when it’s safe for her to come home. But it may never be safe, and their enemies are closing in. Ilsa and Ram are being hunted, and they must flee through the dangers that bar them from their homeland.  She is a Dragon but has’t learned that yet.  Some believe those ancient monsters don’t deserve to live.",
  },
  "key2": {
    author: "Abramson, Traci Hunter",
    title: "Smokescreen",
    sexRating: "",
    profanityRating: "",
    violenceRating: "",
    recommendRating: "8",
    genre: "Fiction",
    imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZ9ZtRc4zKk2-u4exKM9m1TLBgu1kjUS_PYf0P5yqNg3n_5Y12",
    locationOfBook: "Audible",
    reviewDate: "",
    review: "Taylor a young female artist finds herself in the middle of an intrigue she cant understand;  a man was murdered in her hotel room and even when she gets back to the United States she finds that someone is stalking her.  Her boyfriend Quinn, the leader of a squad of navy Seals tries to unravel the mystery while protecting her against whatever and whoever."
  },
  "key3": {
    author: "Beery, Catherine",
    seriesTitle: "Facades",
    seriesBookNumber: 2,
    title: "Defender of the Empire",
    sexRating: "T",
    profanityRating: "B",
    violenceRating: "FV",
    recommendRating: "8",
    genre: "",
    imageUrl: "http://ecx.images-amazon.com/images/I/51RjCiygDjL._SX310_BO1,204,203,200_.jpg",
    locationOfBook: "Kindle",
    reviewDate: "",
    review: "My name is Rylynn Sinclair, and I have survived the Admiral’s Challenge and my first month at the Legion Fleet Academy. I was even made a crewman, along with my friends, stationed on the Hail Mary.  Then my past caught up with me.  It all started with Ace showing up in my room talking with my roommate, and the letter he had. From that point on, everything in my life started to pull me back to Colony Lenti and the secrets that surrounded it."
  }
}

      // <ol>
      //   <li>Title</li>
      //   <li>Author</li>
      //   <li>Series</li>
      //   <li>Overall Rating</li>
      // </ol>

var Search = React.createClass({
  render: function() {
    var books = Object.keys(data).map((key) => {
      var book = data[key];
      return <BookReview2 key={key} book={book}/>
    })
    return (
      <div>
        {books}
      </div>
    );
  }
});

module.exports = Search;
