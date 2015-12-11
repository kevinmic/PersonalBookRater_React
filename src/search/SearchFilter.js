import React from 'react';
var PropTypes = React.PropTypes;

var SearchFilter = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          Default Reviewer:
          <select>
            <option>Don Dodge</option>
            <option>Tammy Dresen</option>
            <option>Teri Pay</option>
          </select>
        </div>
        <div className="row">
          Sort By:
          <select>
            <option>Title</option>
            <option>Review Date</option>
            <option>Overall Rating</option>
          </select>
        </div>
        <div className="row">
          Filter Type:
          <select>
            <option>Title</option>
            <option>Author</option>
            <option>Overall Rating</option>
            <option>Series</option>
          </select>
          <input type="text"/>
        </div>
      </div>
    )

  }
});

module.exports = SearchFilter;
