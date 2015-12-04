import React from 'react';
import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField} from './FormField';
import RatingOptions from './RatingOptions';
var PropTypes = React.PropTypes;

const authors = ['Sanderson, Brandon', 'Smith, Johsnon', 'Sankers, Jack', 'Dodge, Kevin'];
const titles = ['Title 1', 'Title 2', 'Title 3'];
const series = ['Series 1', 'Series 2', 'Series 3'];
const genres = ['Fantasy', 'Fiction', 'Sci Fi'];
const locations = ['Dons Kindle', 'Dons Audible', 'Library', 'Keiths Audible'];

function getTitleSuggestions(input, callback) {
  getSuggestions(titles, input, callback);
}

function getSeriesSuggestions(input, callback) {
  getSuggestions(series, input, callback);
}

function getAuthorSuggestions(input, callback) {
  getSuggestions(authors, input, callback);
}

function getGenreSuggestions(input, callback) {
  getSuggestions(genres, input, callback);
}

function getLocationOfBookSuggestions(input, callback) {
  getSuggestions(locations, input, callback);
}

function getSuggestions(list, input, callback) {
  const regex = new RegExp('^' + input, 'i');
  const suggestions = list.filter(suburb => regex.test(suburb));

  setTimeout(() => callback(null, suggestions), 300); // Emulate API call
}

function showAlways() {
  return true;
}

var AddReviewMain = React.createClass({
  getInitialState: function() {
    return {
      title:"",
      series:"",
      bookNum:"",
      imageUrl:"",
      author:"",
      genre:"",
      bookLocation:"",
      overallRating:"",
      profanityRating:"",
      sexualRating:"",
      violenceRating:"",
      reviewDescription:"",
      showError: false,
    };
  },
  addReview: function() {
    console.log("Add Review");
    this.setState({showError: true});
  },
  onChange: function(prop) {
    var data = {};
    data[prop.target.id] = prop.target.value;
    this.setState(data);
  },
  onChangeWithValue: function(id, value) {
    var data = {};
    data[id] = value;
    this.setState(data);
  },
  render: function() {
    var imageUrl = "";
    if (this.state.imageUrl) {
      imageUrl = <div>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <img className="img-responsive" src={this.state.imageUrl} />
          </div>
        </div>
        <div className="row">
          &nbsp;
        </div>
      </div>
    }
    return (
      <div>
        <h2>Book Review</h2>
        <form className="form-horizontal" onSubmit={this.addReview} onkeypress="if(event.keyCode == 13) addReview(this); return false;">
          <AutoSuggestFormField required={true} data={this.state} label="Title" id="title" suggestions={getTitleSuggestions} onChange={this.onChangeWithValue}/>
          <AutoSuggestFormField required={this.state.bookNum != ""} data={this.state} label="Series" id="series" suggestions={getSeriesSuggestions} onChange={this.onChangeWithValue}/>
          <FormField required={this.state.series != ""} data={this.state} label="Book Number" id="bookNum">
            <input type="number" className="form-control" id="bookNum" onChange={this.onChange}/>
          </FormField>
          <FormField label="Image Url" id="imageUrl">
            <input type="text" className="form-control" id="imageUrl" onChange={this.onChange}/>
          </FormField>
          {imageUrl}

          <AutoSuggestFormField label="Author" id="author" suggestions={getAuthorSuggestions} onChange={this.onChangeWithValue}/>
          <AutoSuggestFormField
            label="Genre"
            id="genre"
            suggestions={getGenreSuggestions}
            onChange={this.onChangeWithValue}
            showWhen={function() {return true}}
            />
          <AutoSuggestFormField
            label="Location of Book"
            id="bookLocation"
            suggestions={getLocationOfBookSuggestions}
            onChange={this.onChangeWithValue}
            showWhen={function() {return true}}
            />
          <RatingOptions label="Overall Rating"id="overallRating" rateList={Scales.scaleMapToList(Scales.RATING_SCALE)} onChange={this.onChange}/>
          <RatingOptions label="Profanity Rating" id="profanityRating" rateList={Scales.scaleMapToList(Scales.PROFANITY_SCALE)} onChange={this.onChange}/>
          <RatingOptions label="Sexual Rating" id="sexualRating" rateList={Scales.scaleMapToList(Scales.SEXUAL_SCALE)} onChange={this.onChange}/>
          <RatingOptions label="Violence Rating" id="violenceRating" rateList={Scales.scaleMapToList(Scales.VIOLENCE_SCALE)} onChange={this.onChange}/>
          <FormField label="Review" id="reviewDescription">
            <textarea className="form-control" rows="5" id="reviewDescrption" onChange={this.onChange}/>
          </FormField>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = AddReviewMain;
