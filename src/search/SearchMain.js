import React from 'react';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';
import SearchFilter from './SearchFilter';
import sortIt from './sort.js';
import filterBooks from './filter.js';
import Scales from '../const/ScaleConst';
import Pagin from './Pagination';

const sortOptions = [
  {label: "Title", name:"title", asc: true},
  {label: "Author", name:"author", asc: true},
  {label: "Series", name:"seriesBookNumber", asc: true},
  {label: "Date Reviewed", name:"reviewDate", asc: false},
  {label: "Overall Rating / Date Reviewed", name:"overallRating", asc: false},
]

const PAGE_SIZE = 20;

const INITIAL_STATE = {
  search: "",
  filterOptions: {
    sort: {sortType: 'reviewDate', sortAsc: false},
  },
  startIndex: 0,
};

var setupOverallRating = function(books) {
  return books.map((book) => {
    var reviews = _.values(book.reviews);
    if (reviews && reviews.length > 0) {
      var value = _.sum(reviews, (review) => review.recommendRating) / reviews.length;
      book.overallRating = (Math.round(value * 10)/10);
    }
    return book;
  });
};

var setupLatestReviewDate = function(books) {
  return books.map((book) => {
    var latestReviewDate = 0;
    var reviews = _.values(book.reviews);
    if (reviews && reviews.length > 0) {
      latestReviewDate = _.max(reviews.map((review) => review.reviewDate));
    }
    book.latestReviewDate = latestReviewDate;
    return book;
  });
};

var filterByScale = function(reviewKey, checkVal, books, scale, required) {
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
      else if (required) {
        include = false;
      }
    }
    else if (required) {
      include = false;
    }
    return include;
  });
}

var runFilterBooks = function(books, search, filterOptions, auth) {
    var {sort, read, overallRating, profanityRating, sexRating, violenceRating, age, locationOfBook, genre, reviewer}  = filterOptions;
    books = filterBooks(search, books);
    if (overallRating) {
      var overallInt = parseInt(overallRating);
      books = books.filter((book) => book.overallRating && parseInt(book.overallRating) >= overallInt);
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
    if (age) {
      books = filterByScale('ageAppropriate', age, books, Scales.AGE_SCALE, true);
    }
    if (locationOfBook) {
      books = books.filter((book) => book.locationOfBook && book.locationOfBook.indexOf(locationOfBook) >= 0);
    }
    if (genre) {
      books = books.filter((book) => book.genre && book.genre.indexOf(genre) >= 0);
    }
    if (reviewer) {
      books = books.filter((book) => book.reviews && book.reviews[reviewer]);
    }

    if (auth && read) {
      var hasRead = read == "yes";
      books = books.filter((book) => {
        var check = (book.reviews && book.reviews[auth.userid])?true:false;
        return check == hasRead;
      });
    }
    books = sortIt(books, sort.sortType, sort.sortAsc);
    return books;
}

var filterBooksForPagination = function(books, startIndex, pageSize) {
    var endIndex = startIndex + pageSize;
    if (endIndex > books.length) {
      endIndex = books.length;
    }
    if (startIndex < endIndex) {
      return books.slice(startIndex, endIndex);
    }
    else {
      return [];
    }
}

var Search = React.createClass({
  propTypes: {
    books: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired,
    storeSearch: React.PropTypes.func.isRequired,
    prevSearch: React.PropTypes.object,
    loadingBooks: React.PropTypes.bool.isRequired,
    loadingReviews: React.PropTypes.bool.isRequired,
    searchId: React.PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return _.cloneDeep(INITIAL_STATE);
  },
  componentWillMount: function() {
    if (!_.isEmpty(this.props.prevSearch)) {
      this.setState(this.props.prevSearch);
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.searchId != this.props.searchId && !_.isEmpty(newProps.prevSearch)) {
      this.setState(newProps.prevSearch);
    }
  },
  componentDidUpdate: function() {
    if (!_.isEqual(this.props.prevSearch, this.state)) {
      this.props.storeSearch(this.state);
    }
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
    this.setState({filterOptions: filterOptions, startIndex: 0});
  },
  changeSearch: function(value) {
    if (this.state.search != value) {
      this.setState({search: value, startIndex: 0});
    }
  },
  clearSearch: function() {
    var newState = _.merge({}, this.state);
    newState.search = '';
    _.forEach(_.keys(newState.filterOptions), (key) => {
      if (key != 'sort') {
        newState.filterOptions[key] = '';
      }
    });
    this.setState(newState);
  },
  changeIndex: function(value) {
    this.setState({startIndex: value});
  },
  render: function() {
    var books = setupOverallRating(_.values(this.props.books));
    books = setupLatestReviewDate(books);
    books = runFilterBooks(books, this.state.search, this.state.filterOptions, this.props.auth);
    var totalBooks = books.length;

    books = books.map((book) => {
      return (
        <div key={book.bookId}>
          <BookReview2 bookId={book.bookId} book={book} auth={this.props.auth}/>
          <hr/>
        </div>
      );
    });

    books = filterBooksForPagination(books, this.state.startIndex, PAGE_SIZE);

    var noBooks;
    if (this.props.loadingBooks) {
        noBooks = <div><h3>Loading Books <span className="fa fa-cog fa-spin"/></h3></div>
    }
    else if (books.length <= 0) {
        noBooks = <h3>No Books Found</h3>
    }
    else if (this.props.loadingReviews) {
        noBooks = <div><h3>Loading Reviews <span className="fa fa-cog fa-spin"/></h3></div>
    }

    var sortOptionsUI = sortOptions.map((option) => <option key={option.name} value={option.name}>{option.label}</option>)

    return (
      <table width="100%">
        <tbody>
        <tr>
          <td style={{width: '20%', verticalAlign: 'top', paddingRight:'25px'}}>
            <SearchFilter
              filterOptions={this.state.filterOptions}
              sortOptions={sortOptions}
              search={this.state.search}
              changeSearch={this.changeSearch}
              changeFilter={this.changeFilter}
              clearSearch={this.clearSearch}
              users={this.props.users}
              />
          </td>
          <td style={{paddingLeft:'25px', verticalAlign: 'top'}}>
            <Pagin length={totalBooks} startIndex={this.state.startIndex} pageSize={PAGE_SIZE} changeIndex={this.changeIndex}/>
            <div style={{paddingTop:'10px', marginBottom:'10px'}}>
              Sort By: &nbsp;
              <select value={this.state.filterOptions.sort.sortType} onChange={(obj) => this.changeFilter('sort', obj.target.value)}>
                {sortOptionsUI}
              </select>
            </div>
            {noBooks}
            {books}
            <Pagin length={totalBooks} startIndex={this.state.startIndex} pageSize={PAGE_SIZE} changeIndex={this.changeIndex}/>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
});

module.exports = Search;
