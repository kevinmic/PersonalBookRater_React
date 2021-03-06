import PropTypes from 'prop-types';
import _ from 'lodash'

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
  "10": {key:"10", order:1, labelType:"label-success", description:"Excellent, one of my favorite books; you should definitely read it!"},
  "9": {key:"9", order:2, labelType:"label-success",  description:"Enjoyable, entertaining book that makes me hope for more like it."},
  "8": {key:"8", order:3, labelType:"label-success",  description:"Good solid book"},
  "7": {key:"7", order:4, labelType:"label-success",  description:"The story was entertaining but it is not as well written as it should have been."},
  "6": {key:"6", order:5, labelType:"label-warning",  description:"The book should have been better. Shallow character development and poor writing held it back."},
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
  "LV": {key:"LV", order:2, labelType:"label-success", description:"Violent incidents of low intensity"},
  "MV": {key:"MV", order:4, labelType:"label-warning", description:"Violent incidents of medium intensity"},
  "HV": {key:"HV", order:4, labelType:"label-warning", description:"Violent incidents of high intensity"},
  "VB": {key:"VB", order:5, labelType:"label-danger", description:"Violent, bloody, or shocking, well described mayhem"},
};

const AGE_SCALE = {
  "C": {key:"C", order:1, labelType:"label-default", description:"Children"},
  "PT": {key:"PT", order:2, labelType:"label-default", description:"Pre-Teen"},
  "T": {key:"T", order:3, labelType:"label-default", description:"Teen"},
  "A": {key:"A", order:4, labelType:"label-default", description:"Adult"},
}

export default {
  scaleMapToList,
  SCALE_PROPTYPE,
  RATING_SCALE,
  PROFANITY_SCALE,
  SEXUAL_SCALE,
  VIOLENCE_SCALE,
  AGE_SCALE,
};
