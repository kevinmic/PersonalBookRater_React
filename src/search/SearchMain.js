import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';
import SearchFilter from './SearchFilter';
import sortIt from './sort.js';
import filterBooks from './filter.js';
import Scales from '../const/ScaleConst';

const sortOptions = [
  {label: "Title", name:"title", asc: true},
  {label: "Name", name:"author", asc: true},
  {label: "DateReviewed", name:"reviewDate", asc: false},
  {label: "Overall Rating", name:"overallRating", asc: false},
]

var setupOverallRating = function(books) {
  return books.map((book) => {
    var reviews = _.values(book.reviews);
    if (reviews && reviews.length > 0) {
      var value = _.sum(reviews, (review) => review.recommendRating) / reviews.length;
      book.overallRating = (Math.round(value * 10)/10).toString();
    }
    return book;
  });
};

var filterByScale = function(reviewKey, checkVal, books, scale) {
  var maxValue = scale[checkVal].order;
  return books.filter((book) => {
    var include = true;
    if (book.reviews) {
      var values = _.values(book.reviews)
                    .map((review) => review[reviewKey])
                    .filter((val) => val && scale[val])
                    .map((val) => {
                      return scale[val].order;
                    });
      if (values) {
        var value = _.sum(values) / values.length
        include = value <= maxValue;
      }
    }
    return include;
  });
}

var runFilterBooks = function(books, search, filterOptions, auth) {
    var {sort, read, overallRating, profanityRating, sexRating, violenceRating}  = filterOptions;
    if (overallRating) {
      books = books.filter((book) => book.overallRating && parseInt(book.overallRating) >= parseInt(overallRating));
    }
    if (profanityRating) {
      books = filterByScale('profanityRating', profanityRating, books, Scales.PROFANITY_SCALE);
    }
    if (sexRating) {
      books = filterByScale('sexRating', sexRating, books, Scales.SEXUAL_SCALE);
    }
    if (violenceRating) {
      books = filterByScale('violenceRating', violenceRating, books, Scales.VIOLENCE_SCALE);
    }
    if (auth && read) {
      var hasRead = read == "yes";
      books = books.filter((book) => {
        var check = (book.reviews && book.reviews[auth.userid])?true:false;
        return check == hasRead;
      });
    }
    books = filterBooks(search, books);
    books = sortIt(books, sort.sortType, sort.sortAsc);
    return books;
}

var Search = React.createClass({
  propTypes: {
    books: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      sortType: "reviewDate",
      sortAsc: true,
      search: "",
      sortOptions: sortOptions,
      filterOptions: {
        'sort': {sortType: 'reviewDate', sortAsc: false},
      },
      rating: "",
      showNumberOfBooks: 5,
    };
  },
  changeFilter: function(type, value) {
    var filterOptions = this.state.filterOptions;
    if (type == 'sort') {
      var asc = sortOptions.filter((option) => option.name == value)[0].asc;
      filterOptions.sort = {sortType: value, sortAsc: asc};
    }
    else {
      filterOptions[type] = value;
    }
    this.setState({filterOptions: filterOptions});
  },
  changeSearch: function(value) {
      if (this.state.search != value) {
        this.setState({search: value});
      }
  },
  showMoreBooks: function() {
    this.setState({showNumberOfBooks: this.state.showNumberOfBooks + 10})
  },
  render: function() {
    var books = setupOverallRating(_.values(this.props.books));
    books = runFilterBooks(books, this.state.search, this.state.filterOptions, this.props.auth);
    books = books.map((book) => {
      return (
        <div key={book.bookId}>
          <BookReview2 bookId={book.bookId} book={book} auth={this.props.auth}/>
          <hr/>
        </div>
      );
    });

    var showMoreBooks;
    if (books.length > this.state.showNumberOfBooks) {
      books = books.slice(0, this.state.showNumberOfBooks);
      showMoreBooks = <button type="button" onClick={this.showMoreBooks}>Show More Books</button>;
    }

    return (
      <table width="100%">
        <tbody>
        <tr>
          <td style={{width: '20%', verticalAlign: 'top', paddingLeft:'15px', paddingRight:'25px'}}>
            <SearchFilter
              filterOptions={this.state.filterOptions}
              sortOptions={sortOptions}
              search={this.state.search}
              changeSearch={this.changeSearch}
              changeFilter={this.changeFilter}
              />
          </td>
          <td style={{paddingLeft:'25px'}}>
            {books}
            {showMoreBooks}
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
});

module.exports = Search;
