import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const activeStyle = {
  backgroundColor: '#D0D0D0',
};
const buttonStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '5px',
  borderWidth: '1px',
  marginRight: '5px',
};

var getOrElseMin = function(desired, min) {
  return desired < min?min:desired;
}

var getOrElseMax = function(desired, max) {
  return desired > max?max:desired;
}

var generateButtonForPage = function(pageZeroBased, pageSize, changeIndex, currPage) {
  var index = pageZeroBased * pageSize;
  var pageOneBased = pageZeroBased + 1;
  return generateButton(pageZeroBased, pageOneBased, pageZeroBased === currPage, () => changeIndex(index));
}

var generateButton = function(key, label, isActive, onClick) {
  var style = _.merge({}, buttonStyle);
  if (isActive) {
    style = _.merge(style, activeStyle)
  }

  return <button key={key} style={style} type="button" onClick={onClick}>{label}</button>
}

class Pagination extends React.Component{
  static propTypes = {
    length : PropTypes.number.isRequired,
    startIndex: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    changeIndex: PropTypes.func.isRequired,
  }

  render() {
    var {startIndex, length, pageSize} = this.props;
    var currPage = 0;
    var pages = 1;
    if (startIndex > 0) {
      currPage = startIndex/pageSize;
    }
    if (length > 0) {
      pages = Math.ceil(length/pageSize);
    }

    var left
    var pagesUI = [];

    var startPage = getOrElseMin(currPage - 5, 0);

    pagesUI.push(generateButton('prevAll', 'First', false, () => this.props.changeIndex(0)));
    pagesUI.push(generateButton('prev5', 'Prev 5', false, () => this.props.changeIndex(getOrElseMin(currPage-5,0)* pageSize)));
    pagesUI.push(generateButton('prev1', 'Prev', false, () => this.props.changeIndex(getOrElseMin(currPage-1,0)* pageSize)));
    pagesUI.push(<span key="sep1">&nbsp;&nbsp;&nbsp;</span>);

    if (startPage > 0) {
      pagesUI.push(<span key="prevdot" style={buttonStyle}>...</span>);
    }

    var lastPage = getOrElseMax(currPage + 6, pages);

    for (var i = startPage; i < lastPage; i++) {
      pagesUI.push(generateButtonForPage(i, pageSize, this.props.changeIndex, currPage));
    }

    if (lastPage < pages) {
      if (lastPage < pages - 1) {
        pagesUI.push(<span key="nextdot" style={buttonStyle}>...</span>);
      }
      pagesUI.push(generateButtonForPage(pages - 1, pageSize, this.props.changeIndex, currPage));;
    }

    pagesUI.push(<span key="sep2">&nbsp;&nbsp;&nbsp;</span>);
    pagesUI.push(generateButton('next1', 'Next', false, () =>  this.props.changeIndex(getOrElseMax(currPage+1,pages-1)* pageSize)));
    pagesUI.push(generateButton('next5', 'Next 5', false, () => this.props.changeIndex(getOrElseMax(currPage+5,pages-1)* pageSize)));
    pagesUI.push(generateButton('nextAll', 'Last', false, () => this.props.changeIndex((pages-1) * pageSize)))

    return(
      <div>
        {pagesUI}
      </div>
    );
  }
};

export default Pagination;
