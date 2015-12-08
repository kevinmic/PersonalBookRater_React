import React from 'react';
var PropTypes = React.PropTypes;

var BookImage = React.createClass({
  propTypes: {
    book: PropTypes.object.isRequired
  },
  render: function() {
    return (
      <div className="col-sm-2">
        <img className="img-responsive" src={this.props.book.imageUrl} />
      </div>
    );
  }

});

module.exports = BookImage;
