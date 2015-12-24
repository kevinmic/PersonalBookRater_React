import React from 'react';
var PropTypes = React.PropTypes;
import {FormField} from '../util/FormField';
import Scales from '../const/ScaleConst';

const labelStyle = {
  fontSize: '20px',
  color: '#344c2d',
};

var SearchFilter = React.createClass({
  propTypes: {
    search: PropTypes.string,
    filterOptions: PropTypes.object,
    sortOptions: PropTypes.array,
    changeSearch:  PropTypes.func.isRequired,
    changeFilter:  PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      search: "",
    };
  },
  componentDidMount: function() {
    this.setState({search: this.props.search});
  },
  changeSearchWithObject: function(filterObj) {
    this.changeSearch(filterObj.target.value, false);
  },
  changeSearch: function(value, now) {
    this.setState({search: value});
    if (this.changeSearchTimeout) {
      clearTimeout(this.changeSearchTimeout);
    }
    this.changeSearchTimeout = setTimeout(() => {
      this.props.changeSearch(value);
    }, now?0:700);
  },
  changeFilter: function(type, valueObj) {
    var value = valueObj.target.value
    this.props.changeFilter(type, value);
  },
  render: function() {
    var {filterOptions} = this.props;
    var {search} = this.state;

    var sortOptions = this.props.sortOptions.map((option) => <option key={option.name} value={option.name}>{option.label}</option>)

    return (
      <div>
        <div>
          <label style={labelStyle}>Search</label>
          <input
            className="form-control"
            value={search}
            onChange={this.changeSearchWithObject}
            type="text"
            placeholder="Type in your search"
            data-toggle="tooltip"
            data-placement="bottom"
            onKeyPress={(e) => { if (e.charCode==13) { this.changeSearch(search, true); } }}
            title={"Default Search -- title + author + series \n" +
                   "Specific Fields -- author: title: series:\n" +
                   "Multiple Searches -- seperate with ;\n" +
                   "Example -- Legend; author:Sanderson; series:Mistborn; "
                 }
            />
        </div>
        <div>
          <label style={labelStyle}>Sort</label>
          <select className="form-control" value={filterOptions.sort.sortType} onChange={(obj) => this.changeFilter('sort', obj)}>
            {sortOptions}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Rating</label>
          <select className="form-control" value={filterOptions.overallRating} onChange={(obj) => this.changeFilter('overallRating', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.RATING_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <label style={labelStyle}>Profanity Rating</label>
          <select className="form-control" value={filterOptions.profanityRating} onChange={(obj) => this.changeFilter('profanityRating', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.PROFANITY_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <label style={labelStyle}>Sex Rating</label>
          <select className="form-control" value={filterOptions.sexRating} onChange={(obj) => this.changeFilter('sexRating', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.SEXUAL_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <label style={labelStyle}>Violence Rating</label>
          <select className="form-control" value={filterOptions.violenceRating} onChange={(obj) => this.changeFilter('violenceRating', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.VIOLENCE_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <label style={labelStyle}>Minimum Age</label>
          <select className="form-control" value={filterOptions.age} onChange={(obj) => this.changeFilter('age', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.AGE_SCALE).map((scale) => <option key={scale.key}>{scale.key}</option>)
            }
          </select>
        </div>
        <div>
          <label style={labelStyle}>Read</label>
          <select className="form-control" value={filterOptions.read} onChange={(obj) => this.changeFilter('read', obj)}>
            <option value="">All</option>
            <option value="no">Haven't Read</option>
            <option value="yes">Have Read</option>
          </select>
        </div>
      </div>
    )

  }
});

module.exports = SearchFilter;
