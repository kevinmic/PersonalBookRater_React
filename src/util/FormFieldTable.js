import React from 'react';
import PropTypes from 'prop-types';
import RSelect from 'react-select';
import '../react-select.css';
import TableStyles from '../styles/TableStyles';

const ERROR_STYLE = {
  color: 'red'
}

function stopEnterSubmitting(submitFunction, e, allowEnter) {
    if (e && e.charCode == 13) {
        var src = e.srcElement || e.target;
        if (src.tagName.toLowerCase() != "textarea" && (!src.type || src.type != "submit")) {
            e.preventDefault();
            if (allowEnter && submitFunction) {
              submitFunction();
            }
        }
    }
}

var FormField = React.createClass({
  propTypes: {
    showLabel: PropTypes.bool,
    label : PropTypes.string,
    id : PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    isValid: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      showLabel: true,
      required: false,
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
        {this.props.showLabel?<td style={TableStyles.inputLabel}><label htmlFor={id} style={{...errorStyle, }}>{label}: </label></td>:null}
        <td>
          {this.props.children}
        </td>
      </tr>
    )
  }
});

var FormTable = React.createClass({
  propTypes: {
    onSubmit : PropTypes.func,
    allowEnter : PropTypes.bool,
  },
  render: function() {
    return (
      <form className="form-horizontal" onSubmit={this.props.onSubmit} onKeyPress={(e) => stopEnterSubmitting(this.props.onSubmit, e, this.props.allowEnter)}>
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
    label : PropTypes.string.isRequired,
    showLabel: PropTypes.bool,
    btnType: PropTypes.string,
    onClick : PropTypes.func,
    btnStyle: PropTypes.object,
  },
  getDefaultProps: function() {
    return {
      showLabel: true,
    };
  },
  render: function() {
    var {btnType} = this.props;
    if (!btnType) {
      btnType = "button";
    }

    return (
      <tr>
        {this.props.showLabel?<td/>:null}
        <td style={TableStyles.submitRow}>
          <button type={btnType} style={this.props.btnStyle} onClick={btnType == "submit"?null:this.props.onClick} className="btn btn-default">{this.props.label}</button>
          &nbsp;
          {this.props.children}
        </td>
      </tr>
    );
  }
});

var FormFieldInput = React.createClass({
  propTypes: {
    label : PropTypes.string,
    id : PropTypes.string.isRequired,
    inputType: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
    placeholder: PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      inputType: "text"
    }
  },
  render: function() {
    var {inputType, onChange, placeholder, ...other} = this.props;
    var {id, data} = this.props;

    var className = "form-control";
    if (inputType == 'checkbox' || inputType == 'radio') {
      className = "";
    }
    return (
          <FormField {...other}>
            <input type={inputType} placeholder={placeholder} className={className} value={data[id]} id={id} onChange={onChange}/>
            {this.props.children}
          </FormField>
    )
  }
});

var FormFieldCheckBox = React.createClass({
  propTypes: {
    label : PropTypes.string.isRequired,
    id : PropTypes.string.isRequired,
    data: PropTypes.object,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
  },
  render: function() {
    var {onChange, ...other} = this.props;
    var {id, data} = this.props;

    return (
          <FormField {...other}>
            <input type="checkbox" checked={data[id]} id={id} onChange={onChange}/>
            {this.props.children}
          </FormField>
    )
  }
});

var AutoSuggestFormField = React.createClass({
  propTypes: {
    label : PropTypes.string.isRequired,
    id : PropTypes.string.isRequired,
    options: PropTypes.array,
    multi: PropTypes.bool,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
    showWhen: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      multi: false,
    };
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

    if (!this.props.multi) {
      options = [{value:"", label:""}].concat(options);
    }

    return (
        <FormField {...other}>
          <RSelect
            multi={this.props.multi}
            options={options}
            value={this.props.data[this.props.id]}
            onChange={(values) => {
              var value;
              if (this.props.multi) {
                value = values.map((val) => val.value).join(",");
              }
              else {
                value = values.value;
              }
              this.props.onChange(this.props.id, value);
            }}
            />
        </FormField>
    )
  }
});

module.exports = {
  FormFieldInput,
  FormFieldCheckBox,
  FormField,
  FormTable,
  AutoSuggestFormField,
  stopEnterSubmitting,
  FormFieldSubmit,
};
