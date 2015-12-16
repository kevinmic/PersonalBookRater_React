import React from 'react';
var PropTypes = React.PropTypes;

var SearchFilter = React.createClass({
  propTypes: {
    sortOptions: PropTypes.array.isRequired,
    changeSort:  PropTypes.func.isRequired,
    sortType:  PropTypes.string.isRequired,
    changeFilter: PropTypes.func.isRequired,
    filter: PropTypes.string,
  },
  getInitialState: function() {
    return {
      filter: "",
      sortType: "",
    };
  },
  componentDidMount: function() {
    this.setState({filter: this.props.filter, sortType: this.props.sortType});
  },
  changeFilter: function(filterObj) {
    var value = filterObj.target.value
    this.setState({filter: value});
    if (this.changeFilterTimeout) {
      clearTimeout(this.changeFilterTimeout);
    }
    this.changeFilterTimeout = setTimeout(() => {
      this.props.changeFilter(value);
    }, 700);
  },
  changeSort: function(valueObj) {
    var value = valueObj.target.value
    this.setState({sortType: value});
    this.props.changeSort(value);
  },
  render: function() {
    var sortList = this.props.sortOptions.map((option) => {
      return <option key={option} value={option} >{option}</option>
    } );
    return (
      <div>
        <div className="row">
          Sort By:
          <select value={this.state.sortType} onChange={this.changeSort}>
            {sortList}
          </select>
        </div>
        <div className="row">
          <input
            value={this.state.filter}
            onChange={this.changeFilter}
            type="text"
            placeholder="Type in your search"
            data-toggle="tooltip"
            data-placement="bottom"
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
