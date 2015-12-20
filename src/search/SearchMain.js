import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';
import SearchFilter from './SearchFilter';
import sortIt from './sort.js';
import filterBooks from './filter.js';

const sortOptions = [{name:"title", asc: true}, {name:"author", asc: true}, {name:"reviewDate", asc: false}, {name:"overallRating", asc: false}]

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

var Search = React.createClass({
  propTypes: {
    books: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      sortType: "reviewDate",
      sortAsc: true,
      filterObj: "",
      rating: "",
      showNumberOfBooks: 5,
    };
  },
  changeSort: function(value) {
    var asc = sortOptions.filter((option) => option.name == value)[0].asc;
    this.setState({sortType: value, sortAsc: asc});
  },
  changeRating: function(value) {
    this.setState({rating: value});
  },
  changeFilter: function(value) {
      if (this.state.filter != value) {
        this.setState({filter: value});
      }
  },
  showMoreBooks: function() {
    this.setState({showNumberOfBooks: this.state.showNumberOfBooks + 10})
  },
  render: function() {
    var books = setupOverallRating(_.values(this.props.books));
    if (this.state.rating) {
      books = books.filter((book) => book.overallRating && parseInt(book.overallRating) >= parseInt(this.state.rating));
    }
    books = filterBooks(this.state.filter, books);
    books = sortIt(books, this.state.sortType, this.state.sortAsc).map((book) => {
      return (
        <div key={book.bookId}>
          <BookReview2 bookId={book.bookId} book={book} auth={this.props.auth}/>
          <hr/>
        </div>
      );
    })

    var showMoreBooks;
    if (books.length > this.state.showNumberOfBooks) {
      books = books.slice(0, this.state.showNumberOfBooks);
      showMoreBooks = <button type="button" onClick={this.showMoreBooks}>Show More Books</button>;
    }

    return (
      <div>
          <SearchFilter
            sortType={this.state.sortType}
            rating={this.state.rating}
            changeSort={this.changeSort}
            changeRating={this.changeRating}
            sortOptions={sortOptions.map((option) => option.name)}
            filter={this.state.filter}
            changeFilter={this.changeFilter}
            />
          <hr/>
          {books}
          {showMoreBooks}
       </div>
    );
  }
});

module.exports = Search;
