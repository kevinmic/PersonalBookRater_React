import React from 'react';
var PropTypes = React.PropTypes;

const SCALE_PROPTYPE = PropTypes.shape({
  key: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
});

const RATING_SCALE = [
  {key:"1",  description:"I didnt like it, didnt finish it, and don't recommend it "},
  {key:"2",  description:"I finished this book but didn't like it"},
  {key:"3",  description:"I enjoyed it but not enough to to seek out other books by this author"},
  {key:"4",  description:"It was OK, I might read another book in this series"},
  {key:"5",  description:"I struggled to get caught up in the book but finally enjoyed it"},
  {key:"6",  description:"I liked it but i was uncomfortable with some objectional elements (sex, language, graphic violence)"},
  {key:"7",  description:"Good Book, Conditional recommendation: has objectional content."},
  {key:"8",  description:"Good Book"},
  {key:"9",  description:"Excellent Book, Conditional recommendation: has objectional elements"},
  {key:"10", description:"Excellent Book"}
];

const PROFANITY_SCALE = [
  {key:"A", description:"No Profanity"},
  {key:"B", description:"Ligh use of mild profanity"},
  {key:"C", description:"Limited use of hard profanity"},
  {key:"D", description:"One or more characters in the book tend to use hard profanity"},
  {key:"P", description:"Profane, frequent and uncomfortable use of hard core profanity  "}
];

const SEXUAL_SCALE = [
  {key:"G", description:"No offensive Sexual Content"},
  {key:"T", description:"Teen: Rougher than G, Less than T"},  // T took new description
  {key:"PG", description:"Sexual Tension or Sex Implied"},     // PG moved to T
  {key:"M", description:"Mature: Some undescribed Sexual Encounters"},  // M took PG's spot
  {key:"R", description:"Sexual Encounters described in detail with intent to tittilate"},
];

const VIOLENCE_SCALE = [
  {key:"NV", description:"No or Little Violence"},
  {key:"LV", description:"Some violent incidents not well described"},
  {key:"FV", description:"Frequent violentincidents"},
  {key:"VB", description:"Violent, bloody, or shocking, well described mayhem"},
];

module.exports = {
  SCALE_PROPTYPE: SCALE_PROPTYPE,
  RATING_SCALE: RATING_SCALE,
  PROFANITY_SCALE: PROFANITY_SCALE,
  SEXUAL_SCALE: SEXUAL_SCALE,
  VIOLENCE_SCALE: VIOLENCE_SCALE
};
