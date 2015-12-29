import React from 'react';
var PropTypes = React.PropTypes;

var loadExtra = function(book) {
    var genreVal = book.genre;
    var genre = genreVal?<InnerRow key="genre" label="Genre" value={genreVal}/>:null;
    var location = book.locationOfBook?<InnerRow key="loc" label="Location" value={book.locationOfBook}/>:null;
    var synopsis= book.synopsis?<InnerRow key="synopsis" label="Synopsis" value={book.synopsis}/>:null;
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
        <td style={{whiteSpace:'nowrap', width:'10%', textAlign:'right', verticalAlign:'top', paddingRight:'10px'}} ><b>{this.props.label}:</b></td>
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

    var children;
    if (this.props.children) {
      children = <tr><td colSpan="100%">{this.props.children}</td></tr>
    }

    return (
      <table>
        <tbody>
          {title}
          <InnerRow label="Author" value={book.author}/>
          {series}
          {seriesBookNumber}
          {this.props.showExtra?loadExtra(book):null}
          {children}
        </tbody>
      </table>
    );
  }

});

module.exports = BookData;
