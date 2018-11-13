import firebase from 'firebase/app';
import 'firebase/database';
var WEBTASK_URL;

var loadUrl = function() {
  if (!WEBTASK_URL) {
    firebase.database().ref('/secureData/goodreads_url').on('value', ref => {
      WEBTASK_URL = ref.val();
    });
  }
}

loadUrl();

var lookupBook = function(grBookId, callback) {
  if (!WEBTASK_URL) {
      callback("Goodreads URL not loaded from Firebase, contact Kevin", null);
      return;
  }

  var url = WEBTASK_URL + "?type=book&bookId=" + grBookId;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (param) => {
    if (oReq.status === 200) {
      callback(null, JSON.parse(oReq.response));
    }
    else {
      callback("Error querying url, contact Kevin - " + url, null);
    }
  });
  oReq.open('GET', url, true);
  oReq.send();
}

var searchBook = function(name, callback) {
  if (!WEBTASK_URL) {
      callback("Goodreads URL not loaded from Firebase, contact Kevin", null);
      return;
  }

  var url = WEBTASK_URL + "?type=search&q=" + name;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (param) => {
    if (oReq.status === 200) {
      callback(null, JSON.parse(oReq.response));
    }
    else {
      callback("Error querying url, contact Kevin - " + url, null);
    }
  });
  oReq.open('GET', url, true);
  oReq.send();
};


export default {searchBook, lookupBook, loadUrl};
