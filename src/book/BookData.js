import React from 'react';
import marked from 'marked';
import PropTypes from 'prop-types';
import {SearchBySeries, SearchByAuthor} from '../util/GoToHelper';

marked.setOptions({breaks: true});

var loadExtra = function(book) {
    var genreVal = book.genre;
    var genre = genreVal?<InnerRow key="genre" label="Genre" value={genreVal}/>:null;
    var location = book.locationOfBook?<InnerRow key="loc" label="Location" value={book.locationOfBook}/>:null;
    var synopsis= book.synopsis?<InnerRow key="synopsis" label="Synopsis" value={book.synopsis} markdown={true}/>:null;
    return [genre, location, synopsis];
}

class InnerRow extends React.Component{
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    markdown: PropTypes.bool,
    showExtra: PropTypes.bool,
    showTitle: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    label: "",
    value: "",
    showExtra: true,
    showTitle: false,
    markdown: false,
  }

  render() {
    var value = this.props.value;
    if (this.props.markdown) {
      value = <span dangerouslySetInnerHTML={{__html:marked(value)}}/>
    }
    else if (this.props.onClick) {
      // eslint-disable-next-line
      value = <a onClick={() => this.props.onClick(this.props.value)}>{this.props.value}</a>
    }

    return (
      <tr>
        <td style={{whiteSpace:'nowrap', width:'10%', textAlign:'right', verticalAlign:'top', paddingRight:'10px'}} ><b>{this.props.label}:</b></td>
        <td>{value}</td>
      </tr>
    );
  }
};

class BookData extends React.Component{
  static propTypes = {
    book: PropTypes.object.isRequired
  }

  render() {
    var book = this.props.book;

    if (book.seriesTitle) {
      var series = <InnerRow label="Series" value={book.seriesTitle} onClick={SearchBySeries}/>
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
          <InnerRow label="Author" value={book.author} onClick={SearchByAuthor}/>
          {series}
          {seriesBookNumber}
          {this.props.showExtra?loadExtra(book):null}
          {children}
        </tbody>
      </table>
    );
  }

};

export default BookData;
