I am making this webpage because my Dad reads a ton of books.   I want to read some of those books and need an easy way to see what he has read.

In addition, I want a better rating system than other book rating systems provide.   This tool allows the rating of books by an overall rating, sex rating, profanity rating, and violence rating so that I can filter out books that I don't want to read.

To get this app to work you need to configure a few things.

1.   This app hooks up to firebase.   In order for it to work correctly you will need to create the following file.
config/firebase-info.js

This file contains
module.exports = { firebaseurl: "myFirebaseUrl"  }


2.   The structure of the firebase is defined in firebase.example.json

3.   The write rules of firebase is defined in firebase.rules.json

4.   GoodReads url.
I stored my goodreads/webtask url info inside of firebase so that you had to be logged in to access it.
I could not get a crosssite request to work against GoodReads directly.   So instead I had to create some node code that would do the request for me and return to me the xml.   Then I would publish this webtask to webtask.io .   At the time of this writing webtask.io had free services with the caveat that your webtask only lasts for a month.   Time will tell whether it will be a good solution or not.   A better solution would be to have GoodReads allow for crosssite requests.  An example of my webtask can be found in webtasks/goodreads-example.js.  





---------------------------------
NOTES FOR DEPLOYMENT
---------------------------------
To Deploy run

webpack; firebase deploy


To Setup for a specific Environemnt run one of the following (Note, I haven't committed the files that these scripts point at):
./setup_test.sh
./setup_prod.sh


To Create Webtack run
cd webtasks
wt create goodreads.js
