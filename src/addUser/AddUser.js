import React from 'react';
var PropTypes = React.PropTypes;

import FormValidationMixins from '../util/FormValidationMixins';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
import firebaseInfo from '../../config/firebase-info.js';

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var AddUser = React.createClass({
  mixins: [FormValidationMixins],
  propTypes: {
    auth : React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      showError: false,
      values: {
        name:"",
        email:"",
        password:""
      },
      required: {
        name: () => true,
        email: () => true,
        password: () => true,
      },
      validators: {
        name: (pwd) => pwd && pwd.length > 3,
        email: validateEmail,
        password: (pwd) => pwd && pwd.length > 7,
      }
    };
  },
  addUser: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var {email, password, name} = this.state.values;
      var firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/users");
      firebaseRef.createUser({email: email, password: password}, (error, successInfo) => {
        if (error) {
          switch (error.code) {
            case "EMAIL_TAKEN":
              alertify.error("Email already in use!!!");
              break;
            case "INVALID_EMAIL":
              alertify.error("Invlaid Email Address!!!");
              break;
            default:
              alertify.error("Error creating user!!!");
              break;
          }
        }
        else {
          firebaseRef.child(successInfo.uid).set(name, (error) => {
            if (error) {
              alertify.error("Error saving users name, but the user was created");
            }
            else {
              alertify.success("User:" + email + " Created");
              this.setState({values:{}});
            }
          });
        }
      });
    }
    else {
      this.setState({showError:true});
    }
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    var {values} = this.state;

    return (
      <div>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Name" id="name"
            data={values}
            placeholder="This name will be shown on reviews"
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldInput
            label="Email Address" id="email"
            inputType="email"
            data={values}
            placeholder="Login Name"
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldInput
            inputType="password"
            label="Password" id="password"
            data={values}
            placeholder="Password - At least 8 characters"
            onChange={this.onChange}
            isValid={this.isValid}
            />
        </form>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="button" onClick={this.addUser} className="btn btn-default">Submit</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AddUser;
