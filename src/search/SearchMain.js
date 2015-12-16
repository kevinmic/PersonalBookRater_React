import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';
import SearchFilter from './SearchFilter';
import _ from 'lodash';
import sortIt from './sort.js';
import filterBooks from './filter.js';

const sortOptions = [{name:"title", asc: true}, {name:"author", asc: true}, {name:"reviewDate", asc: false}, {name:"overallRating", asc: false}]

var Search = React.createClass({
  propTypes: {
    books: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      sortType: "reviewDate",
      sortAsc: true,
      filterObj: "",
      showNumberOfBooks: 5,
    };
  },
  changeSort: function(value) {
    var asc = sortOptions.filter((option) => option.name == value)[0].asc;
    this.setState({sortType: value, sortAsc: asc});
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
    var filteredBooks = filterBooks(this.state.filter, _.values(this.props.books));
    var books = sortIt(filteredBooks, this.state.sortType, this.state.sortAsc).map((book) => {
      return <div key={book.bookId}><BookReview2 bookId={book.bookId} book={book}/><hr/></div>
    })

    var showMoreBooks;
    if (books.length > this.state.showNumberOfBooks) {
      books = books.slice(0, this.state.showNumberOfBooks);
      showMoreBooks = <button type="button" onClick={this.showMoreBooks}>Show More Books</button>;
    }

    return (
      <div>
        <div className="col-sm-3">
          <SearchFilter
            sortType={this.state.sortType}
            changeSort={this.changeSort}
            sortOptions={sortOptions.map((option) => option.name)}
            filter={this.state.filter}
            changeFilter={this.changeFilter}
            />
        </div>
        <div className="col-sm-9">
          {books}
        </div>
        {showMoreBooks}
      </div>
    );
  }
});

module.exports = Search;
