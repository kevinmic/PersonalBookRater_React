import React from 'react';
var PropTypes = React.PropTypes;

const SCALE_PROPTYPE = PropTypes.shape({
  key: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  labelType: PropTypes.string.isRequired
});

const scaleMapToList = function(scale) {
  return Object.keys(scale).map((key) => {
    return scale[key];
  });
}

const RATING_SCALE = {
  "1": {key:"1", labelType:"label-danger", description:"I didnt like it, didnt finish it, and don't recommend it "},
  "2": {key:"2", labelType:"label-danger", description:"I finished this book but didn't like it"},
  "3": {key:"3", labelType:"label-warning", description:"I enjoyed it but not enough to to seek out other books by this author"},
  "4": {key:"4", labelType:"label-warning", description:"It was OK, I might read another book in this series"},
  "5": {key:"5", labelType:"label-warning", description:"I struggled to get caught up in the book but finally enjoyed it"},
  "6": {key:"6", labelType:"label-warning", description:"I liked it but i was uncomfortable with some objectional elements (sex, language, graphic violence)"},
  "7": {key:"7", labelType:"label-info", description:"Good Book, Conditional recommendation: has objectional content."},
  "8": {key:"8", labelType:"label-success", description:"Good Book"},
  "9": {key:"9", labelType:"label-success", description:"Excellent Book, Conditional recommendation: has objectional elements"},
  "10": {key:"10",labelType:"label-success", description:"Excellent Book"}
};

const PROFANITY_SCALE = {
  "A": {key:"A", labelType:"label-success", description:"No Profanity"},
  "B": {key:"B", labelType:"label-success", description:"Light use of mild profanity"},
  "C": {key:"C", labelType:"label-warning", description:"Limited use of hard profanity"},
  "D": {key:"D", labelType:"label-danger", description:"One or more characters in the book tend to use hard profanity"},
  "P": {key:"P", labelType:"label-danger", description:"Profane, frequent and uncomfortable use of hard core profanity  "}
};

const SEXUAL_SCALE = {
  "G": {key:"G",  labelType:"label-success", description:"No offensive Sexual Content"},
  "T": {key:"T",  labelType:"label-success", description:"Teen: Rougher than G, Less than PG"},  // T took new description
  "PG": {key:"PG", labelType:"label-warning", description:"Sexual Tension or Sex Implied"},     // PG moved to T
  "M": {key:"M",  labelType:"label-warning", description:"Mature: Some undescribed Sexual Encounters"},  // M took PG's spot
  "R": {key:"R",  labelType:"label-danger", description:"Sexual Encounters described in detail with intent to tittilate"},
};

const VIOLENCE_SCALE = {
  "NV": {key:"NV", labelType:"label-success", description:"No or Little Violence"},
  "LV": {key:"LV", labelType:"label-success", description:"Some violent incidents not well described"},
  "FV": {key:"FV", labelType:"label-warning", description:"Frequent violent incidents"},
  "VB": {key:"VB", labelType:"label-danger", description:"Violent, bloody, or shocking, well described mayhem"},
};

module.exports = {
  scaleMapToList,
  SCALE_PROPTYPE,
  RATING_SCALE,
  PROFANITY_SCALE,
  SEXUAL_SCALE,
  VIOLENCE_SCALE
};
