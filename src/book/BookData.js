import React from 'react';
var PropTypes = React.PropTypes;

var loadExtra = function(book) {
    var genre = book.genre?<InnerRow label="Genre" value={book.genre}/>:"";
    var location = book.location?<InnerRow label="Location" value={book.locationOfBook}/>:"";
    var synopsis= book.synopsis?<InnerRow label="Synopsis" value={book.synopsis}/>:"";
    return (<div>
      {genre}
      {location}
      {synopsis}
    </div>)

}

var InnerRow = React.createClass({
  getDefaultProps: function() {
    return {
      label: "",
      value: "",
      showExtra: true,
      showTitle: false,
    }
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-3"><b>{this.props.label}:</b></div>
        <div className="col-sm-9">{this.props.value}</div>
      </div>
    );
  }
});

var BookData = React.createClass({
  propTypes: {
    book: React.PropTypes.object.isRequired
  },
  render: function() {
    var book = this.props.book;

    if (book.seriesTitle) {
      var series = <InnerRow label="Series" value={book.seriesTitle}/>
    }
    if (book.seriesBookNumber) {
      var seriesBookNumber = <InnerRow label="Book Number" value={book.seriesBookNumber}/>
    }

    if (this.props.showTitle) {
      var title = <InnerRow label="Title" value={book.title}/>
    }

    return (
      <div>
          {title}
          <InnerRow label="Author" value={book.author}/>
          {series}
          {seriesBookNumber}
          {this.props.showExtra?loadExtra(book):""}
          {this.props.children}
      </div>
    );
  }

});

module.exports = BookData;
