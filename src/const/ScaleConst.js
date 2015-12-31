import React from 'react';
var PropTypes = React.PropTypes;

const SCALE_PROPTYPE = PropTypes.shape({
  key: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  labelType: PropTypes.string.isRequired
});

const scaleMapToList = function(scale) {
  var arr = Object.keys(scale).map((key) => {
    return scale[key];
  });
  return _.sortBy(arr, 'order');
}

const RATING_SCALE = {
  "10": {key:"10", order:1, labelType:"label-success", description:"Excellent Book"},
  "9": {key:"9", order:2, labelType:"label-success",  description:"Excellent Book, Conditional recommendation: has objectional elements"},
  "8": {key:"8", order:3, labelType:"label-success",  description:"Good Book"},
  "7": {key:"7", order:4, labelType:"label-success",  description:"Good Book, Conditional recommendation: has objectional content."},
  "6": {key:"6", order:5, labelType:"label-warning",  description:"I liked it but i was uncomfortable with some objectional elements (sex, language, graphic violence)"},
  "5": {key:"5", order:6, labelType:"label-warning",  description:"I struggled to get caught up in the book but finally enjoyed it"},
  "4": {key:"4", order:7, labelType:"label-warning",  description:"It was OK, I might read another book in this series"},
  "3": {key:"3", order:8, labelType:"label-warning",  description:"I enjoyed it but not enough to to seek out other books by this author"},
  "2": {key:"2", order:9, labelType:"label-danger",   description:"I finished this book but didn't like it"},
  "1": {key:"1", order:10, labelType:"label-danger",   description:"I didnt like it, didnt finish it, and don't recommend it "},
};

const PROFANITY_SCALE = {
  "A": {key:"A", order:1, labelType:"label-success", description:"No Profanity"},
  "B": {key:"B", order:2, labelType:"label-success", description:"Light use of mild profanity"},
  "C": {key:"C", order:3, labelType:"label-warning", description:"Limited use of hard profanity"},
  "D": {key:"D", order:4, labelType:"label-danger", description:"One or more characters in the book tend to use hard profanity"},
  "P": {key:"P", order:5, labelType:"label-danger", description:"Profane, frequent and uncomfortable use of hard core profanity  "}
};

const SEXUAL_SCALE = {
  "G": {key:"G",   order:1, labelType:"label-success", description:"No offensive Sexual Content"},
  "T": {key:"T",   order:2, labelType:"label-success", description:"Teen: Rougher than G, Less than PG"},  // T took new description
  "PG": {key:"PG", order:3, labelType:"label-warning", description:"Sexual Tension or Sex Implied"},     // PG moved to T
  "M": {key:"M",   order:4, labelType:"label-warning", description:"Mature: Some undescribed Sexual Encounters"},  // M took PG's spot
  "R": {key:"R",   order:5, labelType:"label-danger", description:"Sexual Encounters described in detail with intent to tittilate"},
};

const VIOLENCE_SCALE = {
  "NV": {key:"NV", order:1, labelType:"label-success", description:"No or Little Violence"},
  "LV": {key:"LV", order:2, labelType:"label-success", description:"Some violent incidents not well described"},
  "FV": {key:"FV", order:3, labelType:"label-warning", description:"Frequent violent incidents"},
  "VB": {key:"VB", order:4, labelType:"label-danger", description:"Violent, bloody, or shocking, well described mayhem"},
};

const AGE_SCALE = {
  "C": {key:"C", order:1, labelType:"label-default", description:"Children"},
  "PT": {key:"PT", order:2, labelType:"label-default", description:"Pre-Teen"},
  "T": {key:"T", order:3, labelType:"label-default", description:"Teen"},
  "A": {key:"A", order:4, labelType:"label-default", description:"Adult"},
}

module.exports = {
  scaleMapToList,
  SCALE_PROPTYPE,
  RATING_SCALE,
  PROFANITY_SCALE,
  SEXUAL_SCALE,
  VIOLENCE_SCALE,
  AGE_SCALE,
};
