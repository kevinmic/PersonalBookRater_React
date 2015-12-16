import React from 'react';
import { History} from 'react-router';
var PropTypes = React.PropTypes;
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from './util/FormField';
import FormValidationMixins from './util/FormValidationMixins';
var alertify = require('alertify-webpack');
import firebaseInfo from '../config/firebase-info.js';

var Login = React.createClass({
  mixins: [History, FormValidationMixins],
  defaultProps: {
    redirect: true,
    message: "",
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
          alertify.log.success("You are now logged in!");
          if (this.props.redirect) {
            this.history.pushState(null, "/review/search");
          }
        }
        else {
          alertify.log.error("Login Failed!");
        }
      });
    }
    else {
      this.setState({showError: true});
      alertify.log.error("Please fill out missing required fields.");
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
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Email" id="email"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
        </form>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Password" id="password"
            inputType="password"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="button" onClick={this.login} className="btn btn-default">Login</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
});

module.exports = Login;