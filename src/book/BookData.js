import React from 'react';
var PropTypes = React.PropTypes;

var InnerRow = React.createClass({
  defaultProps: {
    label: "",
    value: ""
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

    return (
      <div className="row">
        <div className="col-sm-8">
          <InnerRow label="Author" value={book.author}/>
          {series}
          {seriesBookNumber}
          <InnerRow label="Genre" value={book.genre}/>
          <InnerRow label="Location" value={book.locationOfBook}/>
        </div>
      </div>
    );
  }

});

module.exports = BookData;
