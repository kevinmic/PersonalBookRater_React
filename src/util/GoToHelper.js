import PubSub from 'pubsub-js';

var GoToLastSearch = function() {
  PubSub.publish('prevsearch');
};

var SearchBySeries = function(seriesTitle) {
  var search = {search: "series:" + seriesTitle, filterOptions: {sort:{sortType:'seriesBookNumber', sortAsc: true}}};
  PubSub.publish('newsearch', search);
}

var SearchByReviewer = function(reviewer) {
  var search = {filterOptions: {reviewer: reviewer}};
  PubSub.publish('newsearch', search);
}

module.exports = {GoToLastSearch, SearchBySeries, SearchByReviewer};
