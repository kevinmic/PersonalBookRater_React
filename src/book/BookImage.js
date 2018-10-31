import React from 'react';
import PropTypes from 'prop-types';

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
    var image = <img style={imgStyle} width="120px;" src={book.imageUrl} />
    if (!book.imageUrl) {
      image = <div className="fa fa-ban fa-5x" style={{color: '#FA9D9D', paddingTop: '30px', paddingBottom: '30px', width: '120px', verticalAlign: 'center'}}></div>
    }

    if (book.goodreadsId) {
      image = (
          <a href={"https://www.goodreads.com/book/show/" + book.goodreadsId} target="_new">
              {image}
              <br/>
              www.goodreads.com
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
