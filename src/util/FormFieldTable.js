import React from 'react';
import RSelect from 'react-select';
import '../react-select.css';
import TableStyles from '../styles/TableStyles';
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
      <tr>
        <td style={TableStyles.inputLabel}>
          <label htmlFor={id} style={{...errorStyle, }}>{label}: </label>
        </td>
        <td>
          {this.props.children}
        </td>
      </tr>
    )
  }
});

var FormTable = React.createClass({
  propTypes: {
    onSumbit : React.PropTypes.func,
    allowEnter : React.PropTypes.bool,
  },
  render: function() {
    return (
      <form className="form-horizontal" onSubmit={this.props.onSumbit} onKeyPress={this.props.allowEnter?null:stopEnterSubmitting}>
        <table style={TableStyles.tableInput}>
          <tbody>
              {this.props.children}
          </tbody>
        </table>
      </form>
    )
  }
});

var FormFieldSubmit = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    btnType: React.PropTypes.string,
    onClick : React.PropTypes.func,
  },
  render: function() {
    var {btnType} = this.props;
    if (!btnType) {
      btnType = "button";
    }

    return (
      <tr>
        <td/>
        <td style={TableStyles.submitRow}>
          <button type={btnType} onClick={this.props.onClick} className="btn btn-default">{this.props.label}</button>
          &nbsp;
          {this.props.children}
        </td>
      </tr>
    );
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
    placeholder: React.PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      inputType: "text"
    }
  },
  render: function() {
    var {inputType, onChange, placeholder, ...other} = this.props;
    var {id, data} = this.props;
    return (
          <FormField {...other}>
            <input type={inputType} placeholder={placeholder} className="form-control" value={data[id]} id={id} onChange={onChange}/>
          </FormField>
    )
  }
});

var AutoSuggestFormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    options: React.PropTypes.array,
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
    var {suggestions, onChange, options, showWhen, ...other} = this.props;
    if (!showWhen()) {
        return (
          <FormField {...other}>
          </FormField>
        )
    }

    options = [{value:"", label:""}].concat(options);

    return (
        <FormField {...other}>
          <RSelect
            options={options}
            value={this.props.data[this.props.id]}
            onChange={(values) => {
              this.props.onChange(this.props.id, values.value);
            }}
            />
        </FormField>
    )
  }
});

module.exports = {
  FormFieldInput,
  FormField,
  FormTable,
  AutoSuggestFormField,
  stopEnterSubmitting,
  FormFieldSubmit,
};
