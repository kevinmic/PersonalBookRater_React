import React from 'react';
import PropTypes from 'prop-types';
import RSelect from 'react-select';
import '../react-select.css';
import TableStyles from '../styles/TableStyles';

const ERROR_STYLE = {
  color: 'red'
}

function stopEnterSubmitting(submitFunction, e, allowEnter) {
    if (e && e.charCode === 13) {
        var src = e.srcElement || e.target;
        if (src.tagName.toLowerCase() !== "textarea" && (!src.type || src.type !== "submit")) {
            e.preventDefault();
            if (allowEnter && submitFunction) {
              submitFunction();
            }
        }
    }
}

class FormField extends React.Component{
  static propTypes = {
    showLabel: PropTypes.bool,
    label : PropTypes.string,
    id : PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    isValid: PropTypes.func,
  }

  static defaultProps = {
    showLabel: true,
    required: false,
  }

  render() {
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
};

class FormTable extends React.Component{
  static propTypes = {
    onSubmit : PropTypes.func,
    allowEnter : PropTypes.bool,
  }

  render() {
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
};

class FormFieldSubmit extends React.Component{
  static propTypes = {
    label : PropTypes.string.isRequired,
    showLabel: PropTypes.bool,
    btnType: PropTypes.string,
    onClick : PropTypes.func,
    btnStyle: PropTypes.object,
  }

  static defaultProps = {
    showLabel: true,
  }

  render() {
    var {btnType} = this.props;
    if (!btnType) {
      btnType = "button";
    }

    return (
      <tr>
        {this.props.showLabel?<td/>:null}
        <td style={TableStyles.submitRow}>
          <button type={btnType} style={this.props.btnStyle} onClick={btnType === "submit"?null:this.props.onClick} className="btn btn-default">{this.props.label}</button>
          &nbsp;
          {this.props.children}
        </td>
      </tr>
    );
  }
};

class FormFieldInput extends React.Component{
  static propTypes = {
    label : PropTypes.string,
    id : PropTypes.string.isRequired,
    inputType: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    inputType: "text"
  }
  
  render() {
    var {inputType, onChange, placeholder, ...other} = this.props;
    var {id, data} = this.props;

    var className = "form-control";
    if (inputType === 'checkbox' || inputType === 'radio') {
      className = "";
    }
    return (
          <FormField {...other}>
            <input type={inputType} placeholder={placeholder} className={className} value={data[id]} id={id} onChange={onChange}/>
            {this.props.children}
          </FormField>
    )
  }
};

class FormFieldCheckBox extends React.Component{
  static propTypes = {
    label : PropTypes.string.isRequired,
    id : PropTypes.string.isRequired,
    data: PropTypes.object,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
  }

  render() {
    var {onChange, ...other} = this.props;
    var {id, data} = this.props;

    return (
          <FormField {...other}>
            <input type="checkbox" checked={data[id]} id={id} onChange={onChange}/>
            {this.props.children}
          </FormField>
    )
  }
};

class AutoSuggestFormField extends React.Component{
  static propTypes = {
    label : PropTypes.string.isRequired,
    id : PropTypes.string.isRequired,
    options: PropTypes.array,
    multi: PropTypes.bool,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
    showWhen: PropTypes.func,
  }

  static defaultProps = {
    multi: false,
  }

  constructor(props) {
    super(props);
    this.state = {checkValue: ""};
  }

  suggestionsWithId =  (input, callback) => {
    this.props.suggestions(this.props.id, input, callback);
  }

  render() {
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
};

export {
  FormFieldInput,
  FormFieldCheckBox,
  FormField,
  FormTable,
  AutoSuggestFormField,
  stopEnterSubmitting,
  FormFieldSubmit,
};
