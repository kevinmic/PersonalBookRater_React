import React from 'react';
import _ from 'lodash';
import RSelect from 'react-select';
import '../react-select.css';
var PropTypes = React.PropTypes;

const ERROR_STYLE = {
  color: 'red'
}

function stopEnterSubmitting(e) {
    if (e.charCode == 13) {
        var src = e.srcElement || e.target;
        if (src.tagName.toLowerCase() != "textarea" && (!src.type || src.type != "submit")) {
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
    }
}

var FormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired,
    isValid: React.PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      required: false
    }
  },
  render: function() {
    var errorStyle = {};
    var {id, label, data, isValid} = this.props;

    if (!isValid(id)) {
      errorStyle = ERROR_STYLE;
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
    inputType: React.PropTypes.string,
    data: React.PropTypes.object,
    onChange: React.PropTypes.func,
    isValid: React.PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      inputType: "text"
    }
  },
  render: function() {
    var {inputType, onChange, ...other} = this.props;
    var {id, data} = this.props;
    return (
          <FormField {...other}>
            <input type={inputType} className="form-control" value={data[id]} id={id} onChange={onChange}/>
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
  getInitialState: function() {
    return {
      checkValue: ""
    };
  },
  suggestionsWithId: function(input, callback) {
    this.props.suggestions(this.props.id, input, callback);
  },
  render: function() {
    var {suggestions, onChange, showWhen, ...other} = this.props;

    var options = suggestions().map((value) => {return {value:value, label:value}});
    return (
        <FormField {...other}>
          <RSelect
            options={options}
            multi={true}
            allowCreate={true}
            value={this.props.data[this.props.id]}
            onChange={(values) => {
              this.props.onChange(this.props.id, values.map((value) => value.value).join(","));
            }}
            />
        </FormField>
    )
  }
});

module.exports = {
  FormFieldInput,
  FormField,
  AutoSuggestFormField,
  stopEnterSubmitting,
};
