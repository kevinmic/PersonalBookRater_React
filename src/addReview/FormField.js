import React from 'react';
import Autosuggest from 'react-autosuggest';
var PropTypes = React.PropTypes;

const ERROR_STYLE = {
  color: 'red'
}

var FormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    required: React.PropTypes.bool,
    data: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      required: false,
      showError: false
    }
  },
  render: function() {
    var errorStyle = {};
    if (this.props.data && this.props.data.showError && this.props.required && this.props.data[this.props.id] == "") {
      errorStyle = ERROR_STYLE;
    }

    return (
      <div className="form-group">
        <label htmlFor={this.props.id} style={errorStyle} className="col-sm-2 control-label">{this.props.label}: </label>
        <div className="col-sm-10">
          {this.props.children}
        </div>
      </div>
    )
  }
});

var AutoSuggestFormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    suggestions: React.PropTypes.func,
    onChange: React.PropTypes.func,
    showWhen: React.PropTypes.func,
    required: React.PropTypes.bool,
    showError: React.PropTypes.bool
  },
  onChange: function(value) {
    if (this.props.onChange) {
      this.props.onChange(this.props.id, value);
    }
  },
  render: function() {
    var {suggestions, onChange, showWhen, ...other} = this.props;
    return (
        <FormField {...other}>
            <Autosuggest
              suggestions={this.props.suggestions}
              inputAttributes={{ id: this.props.id, className: "form-control", onChange:value => this.onChange(value)}}
              showWhen={this.props.showWhen} />
        </FormField>
    )
  }
});

module.exports = {FormField: FormField, AutoSuggestFormField: AutoSuggestFormField};
