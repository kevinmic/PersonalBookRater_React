import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;

var BookReview = React.createClass({
  render: function() {
    var book = this.props.book;
    return (
        <div className="row">
          <div className="col-sm-2">
            <img className="img-responsive" src={book.imageUrl} />
          </div>
          <div className="col-sm-10">
            <h3>{book.title}</h3>
            <div className="row">
              <div className="col-sm-1">
                <ul>
                  <li>{book.recommendRating}</li>
                  <li>{book.sexRating}</li>
                  <li>{book.swearRating}</li>
                  <li>{book.violenceRating}</li>
                </ul>
              </div>
              <div className="col-sm-8">
                <div className="row">
                  <div className="col-sm-3"><b>Author:</b></div>
                  <div className="col-sm-9">{book.author}</div>
                </div>
                <div className="row">
                  <div className="col-sm-3"><b>Series:</b></div>
                  <div className="col-sm-9">{book.seriesTitle}</div>
                </div>
                <div className="row">
                  <div className="col-sm-3"><b>Book Number:</b></div>
                  <div className="col-sm-9">{book.seriesBookNumber}</div>
                </div>
                <div className="row">
                  <div className="col-sm-3"><b>Location:</b></div>
                  <div className="col-sm-9">{book.locationOfBook}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

});

module.exports = BookReview;
