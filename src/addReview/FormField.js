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
    data: React.PropTypes.object,
    isValid: React.PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      required: false,
      showError: false
    }
  },
  render: function() {
    var errorStyle = {};
    var {id, label, data, isValid} = this.props;

    if (!isValid(id)) {
      if (data.showError && data[id] == "") {
        errorStyle = ERROR_STYLE;
      }
    }

    return (
      <div className="form-group">
        <label htmlFor={id} style={errorStyle} className="col-sm-2 control-label">{label}: </label>
        <div className="col-sm-10">
          {this.props.children}
        </div>
      </div>
    )
  }
});

var FormFieldInput = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    inputType: React.PropTypes.string.isRequired,
    data: React.PropTypes.object,
    onChange: React.PropTypes.func,
    isValid: React.PropTypes.func,
  },
  render: function() {
    var {inputType, onChange, ...other} = this.props;
    return (
          <FormField {...other}>
            <input type={inputType} className="form-control" id={this.props.id} onChange={onChange}/>
          </FormField>
    )
  }
});

var AutoSuggestFormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    suggestions: React.PropTypes.func,
    onChange: React.PropTypes.func,
    isValid: React.PropTypes.func,
    showWhen: React.PropTypes.func,
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
              value={this.props.data[this.props.id]}
              suggestions={this.props.suggestions}
              inputAttributes={{ id: this.props.id, className: "form-control", onChange:value => this.onChange(value)}}
              showWhen={this.props.showWhen} />
        </FormField>
    )
  }
});

module.exports = {FormFieldInput: FormFieldInput, FormField: FormField, AutoSuggestFormField: AutoSuggestFormField};
