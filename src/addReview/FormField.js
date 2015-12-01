import React from 'react';
import Autosuggest from 'react-autosuggest';
var PropTypes = React.PropTypes;

var FormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.id} className="col-sm-2 control-label">{this.props.label}: </label>
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
    showWhen: React.PropTypes.func
  },
  onChange: function(value) {
    if (this.props.onChange) {
      this.props.onChange(this.props.id, value);
    }
  },
  render: function() {
    return (
        <FormField label={this.props.label} id={this.props.id}>
            <Autosuggest
              suggestions={this.props.suggestions}
              inputAttributes={{ id: this.props.id, className: "form-control", onChange:value => this.onChange(value)}}
              showWhen={this.props.showWhen} />
        </FormField>
    )
  }
});

module.exports = {FormField: FormField, AutoSuggestFormField: AutoSuggestFormField};
