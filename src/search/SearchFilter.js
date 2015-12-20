import React from 'react';
var PropTypes = React.PropTypes;
import {FormField} from '../util/FormField';
import Scales from '../const/ScaleConst';

var SearchFilter = React.createClass({
  propTypes: {
    sortOptions: PropTypes.array.isRequired,
    changeSort:  PropTypes.func.isRequired,
    sortType:  PropTypes.string.isRequired,
    rating:  PropTypes.string.isRequired,
    changeFilter: PropTypes.func.isRequired,
    filter: PropTypes.string,
  },
  getInitialState: function() {
    return {
      filter: "",
    };
  },
  componentDidMount: function() {
    this.setState({filter: this.props.filter, sortType: this.props.sortType});
  },
  changeFilterWithObject: function(filterObj) {
    this.changeFilter(filterObj.target.value, false);
  },
  changeFilter: function(value, now) {
    this.setState({filter: value});
    if (this.changeFilterTimeout) {
      clearTimeout(this.changeFilterTimeout);
    }
    this.changeFilterTimeout = setTimeout(() => {
      this.props.changeFilter(value);
    }, now?0:700);
  },
  changeSort: function(valueObj) {
    var value = valueObj.target.value
    this.props.changeSort(value);
  },
  changeRating: function(valueObj) {
    var value = valueObj.target.value
    this.props.changeRating(value);
  },
  render: function() {
    var sortList = this.props.sortOptions.map((option) => {
      return <option key={option} value={option} >{option}</option>
    } );
    return (
      <div>
        <div className="form-inline">
          <label>Sort By:</label>
          <select className="form-control" value={this.props.sortType} onChange={this.changeSort}>
            {sortList}
          </select>
          &nbsp;
          <label>Min Rating:</label>
          <select className="form-control" value={this.props.rating} onChange={this.changeRating}>
            <option></option>
            {
              _.values(Scales.RATING_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <input
            className="form-control"
            value={this.state.filter}
            onChange={this.changeFilterWithObject}
            type="text"
            placeholder="Type in your search"
            data-toggle="tooltip"
            data-placement="bottom"
            onKeyPress={(e) => { if (e.charCode==13) { this.changeFilter(this.state.filter, true); } }}
            title={"Default Search -- title + author + series \n" +
                   "Specific Fields -- author: title: series:\n" +
                   "Multiple Searches -- seperate with ;\n" +
                   "Example -- Legend; author:Sanderson; series:Mistborn; "
                 }
            />

        </div>
      </div>
    )

  }
});

module.exports = SearchFilter;
