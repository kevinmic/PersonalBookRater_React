import React from 'react';
import PropTypes from 'prop-types';
import alertify from 'alertifyjs';
import _ from 'lodash';
import firebase from 'firebase';

import {AutoSuggestFormField, FormField, FormTable, FormFieldSubmit, FormFieldInput} from '../util/FormFieldTable';
import FormValidationMixins from '../util/FormValidationMixins';
import BookImage from '../book/BookImage';
import GenreConst from '../const/GenreConst';
import LocationConst from '../const/LocationConst';
import GoodReads from './GoodReadsBookLookup';
import {GoToLastSearch} from '../util/GoToHelper';

const BOOK_PICK_LIST = ['title', 'seriesTitle', 'seriesBookNumber', 'imageUrl', 'author', 'genre', 'locationOfBook', 'synopsis', 'goodreadsId'];

var bookChanged = function(bookA, bookB) {
  var a = _.pick(bookA, BOOK_PICK_LIST);
  var b = _.pick(bookB, BOOK_PICK_LIST);

  return !_.isEqual(a,b);
}

var saveBook = (bookRef, book, callback) => {
  bookRef.set(book, (error) => {
    if (error) {
      alertify.error("Book " + book.title + " was not saved! Reason: " + error);
    }
    else {
      alertify.success("Book " + book.title + " added!");
      callback();
    }
  });
}

var getDefaultBook = () => ({
  title: '', 
  seriesTitle: '', 
  seriesBookNumber: '', 
  imageUrl: '', 
  author: '', 
  genre: '', 
  locationOfBook: '', 
  synopsis: '', 
  goodreadsId: '',
});

class AddBook extends React.Component{
  static propTypes = {
    books: PropTypes.object,
    initBook: PropTypes.object,
    loadSynopsis: PropTypes.bool,
    bookId: PropTypes.string,
    auth: PropTypes.object,
  }

  constructor(props) {
    super(props);

    var values = getDefaultBook();
    if (this.props.initBook) {
      values = _.pick(this.props.initBook, BOOK_PICK_LIST) 
    }

    this.state = {
      search: {
        books: {},
        manual: false,
      },
      values,
      showError: false,
      required: {
        title: () => true,
        seriesTitle: function(values) {
          return values.seriesBookNumber !== ""
        },
        seriesBookNumber: function(values) {
          return values.seriesTitle !== ""
        },
        author: () => true,
        genre: () => true,
      },
      genres: [],
      locations: [],
    };

    FormValidationMixins.addAndBind(this);
  }

  componentDidMount = () => {
    var book = this.props.initBook;
    if (book && book.goodreadsId && this.props.loadSynopsis) {
      this.loadSynopsis(book.goodreadsId);
    }
  }

  loadSynopsis = (goodreadsId) => {
    if (goodreadsId) {
      GoodReads.lookupBook(goodreadsId, (error, foundBook) => {
        if (error) {
          alertify.error("Goodreads BookId - " + goodreadsId + " could not be looked up! Reason: " + error);
          this.setState({loading:false});
        }
        else {
          var values = this.state.values;
          values.synopsis = foundBook.synopsis;
          this.setState({values: values, loading: false});
        }
      });
      this.setState({loading:true});
      alertify.message("Lookup up synopsis from goodreads");
    }
    else {
      alertify.error("You must specify a goodreads id to load the synopsis");
    }
  }

  addBook = () => {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var book = _.pick(this.state.values, BOOK_PICK_LIST);

      book.changedBy = [{userid: this.props.auth.userid, date: new Date().getTime()}];
      book.reviews = {};

      var firebaseRef = firebase.database().ref('/books');
      var bookRef;
      if (this.props.bookId) {
        bookRef = firebaseRef.child(this.props.bookId);
        bookRef.once("value").then((bookSnapShot) => {
          var data = bookSnapShot.val();
          if (!_.isEmpty(data)) {
            if (bookChanged(data, book)) {
              var changedBy = book.changedBy.concat(data.changedBy?data.changedBy:[]);
              data = _.merge(data, book);
              data.changedBy = changedBy;

              saveBook(bookRef, data, () => {
                GoToLastSearch();
              });
            }
            else {
              alertify.success("Nothing Changed");
              GoToLastSearch();
            }
          }
          else {
            alertify.error("Could not find book.");
          }
        });
      }
      else {
        bookRef = firebaseRef.push();
        book.bookId = bookRef.key;
        saveBook(bookRef, book, () => {
          if (_.get(this.props.auth, 'roles.reviews')) {
            window.location.hash = "#/review/" + book.bookId + "/new";
          }
          else {
            GoToLastSearch();
          }
        });
      }
    }
    else {
      this.setState({showError: true});
      alertify.error("Please fill out missing required fields.");
    }
  }

  addGenre = () => {
    alertify.prompt("New Genre", function (e, str) {
        // str is the input text
        if (e) {
            // user clicked "ok"
        } else {
            // user clicked "cancel"
        }
    }, "Default Value");
  }

  render() {
    var values = this.state.values;

    var imageUrl;
    if (values.imageUrl) {
      imageUrl = (
          <tr>
            <td>
            </td>
            <td>
              <BookImage book={values}/>
            </td>
          </tr>
      )
    }

    if (values.title && this.props.books) {
      var matchingBooks = _.values(this.props.books).filter((book) => values.title === book.title).filter((book) => book.bookId !== this.props.bookId);
      if (matchingBooks.length > 0) {
        var titleDuplicate = (
          <tr>
            <td>
            </td>
            <td style={{color: "red"}}>
              A book with this title already exists
            </td>
          </tr>
        )
      }
    }

    return (
      <div style={{width:'800px'}}>
        <h2>{this.props.bookId?"Edit":"Add"} Book</h2>
        <FormTable onSubmit={this.addBook}>
          <FormFieldInput
            label="Title" id="title"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          {titleDuplicate}

          <FormFieldInput
            label="Series" id="seriesTitle"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <FormFieldInput
            inputType="text"
            label="Book Number" id="seriesBookNumber"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <FormFieldInput
            inputType="text"
            label="GoodReads Id" id="goodreadsId"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldInput
            inputType="url"
            label="Image Url" id="imageUrl"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          {imageUrl}

          <FormFieldInput
            label="Author" id="author"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Genre" id="genre"
            options={GenreConst.map((val) => {return {value: val.value, label: val.value}})}
            showWhen={() => true}
            multi={true}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Owned Location" id="locationOfBook"
            options={LocationConst.map((val) => {return {value: val.value, label: val.value}})}
            multi={true}
            showWhen={() => true}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <FormField data={values} label="Synopsis" id="synopsis" isValid={this.isValid}>
              <textarea
                className="form-control"
                value={values.synopsis}
                rows="5"
                id="synopsis"
                onChange={this.onChange}/>
              {/* eslint-disable-next-line */}
              <div style={{float:'right'}}><a onClick={() => this.loadSynopsis(this.state.values.goodreadsId)}>Load Synopsis from GoodReads.com</a></div>
              {this.state.loading?<div><h5>Loading <span className="fa fa-cog fa-spin"/></h5></div>:null}
          </FormField>


          <FormFieldSubmit onClick={this.addBook} label="Submit"/>
        </FormTable>
      </div>
    );
  }
};

export default AddBook;
