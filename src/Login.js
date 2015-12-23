import React from 'react';
var PropTypes = React.PropTypes;
import { History} from 'react-router';

import {AutoSuggestFormField, FormField, FormTable, FormFieldSubmit, FormFieldInput, stopEnterSubmitting} from './util/FormFieldTable';
import FormValidationMixins from './util/FormValidationMixins';
import firebaseInfo from '../config/firebase-info.js';

var Login = React.createClass({
  mixins: [History, FormValidationMixins],
  getDefaultProps: function() {
    return {
      redirect: true,
      message: "",
    }
  },
  getInitialState: function() {
    return {
      values: {
        email:"",
        password:"",
      },
      showError: false,
      required: {
        email: () => true,
        password: () => true,
      }
    };
  },
  login: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      new Firebase(firebaseInfo.firebaseurl).authWithPassword(this.state.values, (error, successInfo) => {
        if (successInfo) {
          alertify.success("You are now logged in!");
          if (this.props.redirect) {
            this.history.pushState(null, "/review/search");
          }
        }
        else {
          alertify.error("Login Failed!");
        }
      });
    }
    else {
      this.setState({showError: true});
      alertify.error("Please fill out missing required fields.");
    }
  },
  render: function() {
    var {values} = this.state;
    var message = "";
    if (this.props.message) {
      message = <div>{this.props.message}</div>
    }

    return (
      <div>
        {message}
        <FormTable>
          <FormFieldInput
            label="Email" id="email"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldInput
            label="Password" id="password"
            inputType="password"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldSubmit label="Login" onClick={this.login}/>
        </FormTable>
      </div>
    )
  }
});

module.exports = Login;
