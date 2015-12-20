import React from 'react';
var PropTypes = React.PropTypes;

const combinedStyle = {
    verticalAlign: 'top',
    display: 'inline-block',
    textAlign: 'center',
    // width: '120px',
    fontSize: '10px',
};

const imgStyle = {
    paddingRight: '10px',
};

var BookImage = React.createClass({
  propTypes: {
    book: PropTypes.object.isRequired
  },
  render: function() {
    var {book} = this.props;
    var image = <img style={imgStyle} height="150px;" src={book.imageUrl} />
    if (book.goodreadsId) {
      image = (
          <a href={"https://www.goodreads.com/book/show/" + book.goodreadsId}>
              {image}
              <div style={{display: 'block'}}>goodreads</div>

          </a>
      );
    }
    return (
      <div style={combinedStyle}>
        {image}
      </div>
    );
  }

});

module.exports = BookImage;
