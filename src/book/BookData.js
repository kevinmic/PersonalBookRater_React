import React from 'react';
var PropTypes = React.PropTypes;

var loadExtra = function(book) {
    var genre = book.genre?<InnerRow key="genre" label="Genre" value={book.genre}/>:null;
    var location = book.location?<InnerRow key="loc" label="Location" value={book.locationOfBook}/>:null;
    var synopsis= book.synopsis?<InnerRow key="synopsis" label="Synopsis" value={book.synopsis}/>:null;
    // return [genre, location, synopsis,]
    return [genre, location, synopsis];
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
      <tr>
        <td style={{whiteSpace:'nowrap', width:'10%', textAlign:'right', paddingRight:'10px'}} ><b>{this.props.label}:</b></td>
        <td>{this.props.value}</td>
      </tr>
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
      <table>
        <tbody>
          {title}
          <InnerRow label="Author" value={book.author}/>
          {series}
          {seriesBookNumber}
          {this.props.showExtra?loadExtra(book):""}
        </tbody>
      </table>
    );
  }

});

module.exports = BookData;
