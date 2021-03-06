import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Scales from '../const/ScaleConst';
import GenreConst from '../const/GenreConst';
import LocationConst from '../const/LocationConst';

const bigLabelStyle = {
  fontSize: '26px',
  color: '#344c2d',
};

const labelStyle = {
  fontSize: '14px',
  color: '#344c2d',
};

const activeLabelStyle = {
  fontSize: '14px',
  color: '#7da96f',
};

var getGenreFilters = function() {
  var options = [];
  options.push(<option key="nonGen" value="">All</option>);
  return options.concat(GenreConst.map((genre) => <option key={genre.value} value={genre.value}>{genre.value}</option>))
}

var getLocationFilters = function() {
  var options = [<option key="nonLoc" value="">All</option>];
  return options.concat(LocationConst.map((loc) => <option key={loc.value} value={loc.value}>{loc.value}</option>));
}

class ExpandableFilter extends React.Component{
  static propTypes = {
    label : PropTypes.string.isRequired,
    showLabelWhenExpanded: PropTypes.bool,
    // data: PropTypes.bool, -- This should be a bool, but javascript passes objects when I do true/false statements
  }

  static defaultProps = {
    showLabelWhenExpanded: true
  }

  constructor(props) {
    super(props);
    this.state = {expanded : false};
  }

  componentWillMount = () => {
    if (this.props.data) {
      this.setState({expanded:true});
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.data) {
      this.setState({expanded:true});
    }
  }

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    var expanded;
    var caretStyle = "fa fa-caret-right";
    if (this.state.expanded) {
      caretStyle = "fa fa-caret-down";
      expanded = <div>{this.props.children}</div>
    }

    var labelUI = (
      <div>
        {/* eslint-disable-next-line */}
        <a onClick={this.toggleExpand} style={{textDecoration:'none'}}><span className={caretStyle}/>&nbsp;<label style={this.props.data?activeLabelStyle:labelStyle}>{this.props.label}</label></a>
      </div>
    );

    if (!this.props.showLabelWhenExpanded && this.state.expanded) {
      labelUI = null;
    }

    return (
      <div>
        {labelUI}
        {expanded}
      </div>
    );
  }
};

class SearchTips extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      search: this.props.search,
    };
  }

  onClick = () => {
    this.setState({show: !this.state.show});
  }

  render() {
    var show = null;
    if (this.state.show) {
      show = (
        <div style={{textAlign:'left'}}>
          <div style={{paddingBottom:'10px'}}>
            <b>Example:
              <br/>
              Well; author:Sanderson; series:Mistborn;</b>
          </div>
          <div style={{paddingBottom:'10px'}}>
            The default search searches title, author and series.
          </div>
          <div style={{paddingBottom:'10px'}}>
            You can search a specific field by prepending the search
            with one of the following (author:,  title:, series:).
          </div>
          <div style={{paddingBottom:'10px'}}>
            If you want two distinct searches then seperate the searches with a semi-colon (;)
          </div>
        </div>
      )
    }

    return (
      <div style={{textAlign:'right'}}>
        {/* eslint-disable-next-line */}
        <a onClick={this.onClick}>Search Tips</a>
        {show}
      </div>
    )
  }
};

class SearchFilter extends React.Component{
  static propTypes = {
    search: PropTypes.string,
    filterOptions: PropTypes.object,
    sortOptions: PropTypes.array,
    changeSearch:  PropTypes.func.isRequired,
    changeFilter:  PropTypes.func.isRequired,
    clearSearch: PropTypes.func.isRequired,
    users: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {search:props.search};
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.search !== this.props.search) {
      this.setState({search: newProps.search});
    }
  }

  changeSearchWithObject = (filterObj) => {
    this.changeSearch(filterObj.target.value, false);
  }

  changeSearch = (value, now) => {
    this.setState({search: value});
    if (this.changeSearchTimeout) {
      clearTimeout(this.changeSearchTimeout);
    }
    this.changeSearchTimeout = setTimeout(() => {
      this.props.changeSearch(value);
    }, now?0:700);
  }

  changeFilter = (type, valueObj) => {
    var value = valueObj.target.value
    this.props.changeFilter(type, value);
  }

  clearSearch = () => {
    this.props.clearSearch();
    this.setState({search:""})
  }

  render() {
    var {filterOptions, users} = this.props;
    var {search} = this.state;

    return (
      <div>
        <div>
          <label style={bigLabelStyle}>Search</label>
        </div>
        <div>
          <label style={search?activeLabelStyle:labelStyle}>Title | Author | Series</label>
          <input
            className="form-control"
            value={search}
            onChange={this.changeSearchWithObject}
            type="text"
            placeholder="Type in your search"
            data-toggle="tooltip"
            data-placement="bottom"
            onKeyPress={(e) => { if (e.charCode===13) { this.changeSearch(search, true); } }}
            title={"Default Search -- title + author + series \n" +
                   "Specific Fields -- author: title: series:\n" +
                   "Multiple Searches -- seperate with ;\n" +
                   "Example -- Well; author:Sanderson; series:Mistborn; "
                 }
            />
          <SearchTips/>
        </div>
        <div>
          <label style={bigLabelStyle}>Refine By</label>
        </div>
        <div>
          <label style={filterOptions.overallRating?activeLabelStyle:labelStyle}>Overall Rating</label>
          <select className="form-control" value={filterOptions.overallRating} onChange={(obj) => this.changeFilter('overallRating', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.RATING_SCALE).map((scale) => <option key={scale.key} value={scale.key}>{scale.key + " - " + scale.description}</option>)
            }
          </select>
        </div>
          <ExpandableFilter label="Profanity Rating" data={filterOptions.profanityRating}>
            <select className="form-control" value={filterOptions.profanityRating} onChange={(obj) => this.changeFilter('profanityRating', obj)}>
              <option value="">All</option>
              {
                _.values(Scales.PROFANITY_SCALE).map((scale) => <option key={scale.key} value={scale.key}>{scale.key + " - " + scale.description}</option>)
              }
            </select>
          </ExpandableFilter>
          <ExpandableFilter label="Sex Rating" data={filterOptions.sexRating}>
            <select className="form-control" value={filterOptions.sexRating} onChange={(obj) => this.changeFilter('sexRating', obj)}>
              <option value="">All</option>
              {
                _.values(Scales.SEXUAL_SCALE).map((scale) => <option key={scale.key} value={scale.key}>{scale.key + " - " + scale.description}</option>)
              }
            </select>
          </ExpandableFilter>
          <ExpandableFilter label="Violence Rating" data={filterOptions.violenceRating}>
            <select className="form-control" value={filterOptions.violenceRating} onChange={(obj) => this.changeFilter('violenceRating', obj)}>
              <option value="">All</option>
              {
                _.values(Scales.VIOLENCE_SCALE).map((scale) => <option key={scale.key} value={scale.key}>{scale.key + " - " + scale.description}</option>)
              }
            </select>
          </ExpandableFilter>
        <ExpandableFilter label="Minimum Age" data={filterOptions.age}>
          <select className="form-control" value={filterOptions.age} onChange={(obj) => this.changeFilter('age', obj)}>
            <option value="">All</option>
            {
              _.values(Scales.AGE_SCALE).map((scale) => <option key={scale.key} value={scale.key}>{scale.description}</option>)
            }
          </select>
        </ExpandableFilter>
        <ExpandableFilter label="Read" data={filterOptions.read}>
          <select className="form-control" value={filterOptions.read} onChange={(obj) => this.changeFilter('read', obj)}>
            <option value="">All</option>
            <option value="no">Haven't Read</option>
            <option value="yes">Have Read</option>
          </select>
        </ExpandableFilter>
        <ExpandableFilter label="Reviewer" data={filterOptions.reviewer}>
          <select className="form-control" value={filterOptions.reviewer} onChange={(obj) => this.changeFilter('reviewer', obj)}>
            <option value="">All</option>
            {
              _.keys(users).map((key) => <option key={key} value={key}>{users[key].name}</option>)
            }
          </select>
        </ExpandableFilter>
        <ExpandableFilter label="Genre" data={filterOptions.genre}>
          <select className="form-control" value={filterOptions.genre} onChange={(obj) => this.changeFilter('genre', obj)}>
            {getGenreFilters()}
          </select>
        </ExpandableFilter>
        <ExpandableFilter label="Location" data={filterOptions.locationOfBook}>
          <select className="form-control" value={filterOptions.locationOfBook} onChange={(obj) => this.changeFilter('locationOfBook', obj)}>
            {getLocationFilters()}
          </select>
        </ExpandableFilter>
        <div>
          <input type="button" onClick={this.clearSearch} value="Reset"/>
        </div>
      </div>
    )

  }
};

export default SearchFilter;
