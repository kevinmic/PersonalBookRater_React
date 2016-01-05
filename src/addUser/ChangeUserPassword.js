import React from 'react';
var PropTypes = React.PropTypes;

import FormValidationMixins from '../util/FormValidationMixins';
import {AutoSuggestFormField, FormFieldCheckBox, FormField, FormFieldSubmit, FormTable, FormFieldInput, stopEnterSubmitting} from '../util/FormFieldTable';
import firebaseInfo from '../../config/firebase-info.js';
import TableStyles from '../styles/TableStyles';

var ChangeUserPassword = React.createClass({
  mixins: [FormValidationMixins],
  propTypes: {
    auth : React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      showError: false,
      values: {
        email: '',
        oldPassword: '',
        newPassword: '',
      },
      required: {
        email: () => true,
        oldPassword: () => true,
        newPassword: () => true,
      },
      validators: {
        newPassword: (pwd) => pwd && pwd.length > 6,
      }
    };
  },
  componentDidMount: function() {
    this.setState({values: {email: this.props.auth.username}});
  },
  changePassword: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var firebaseRef = new Firebase(firebaseInfo.firebaseurl);

      firebaseRef.changePassword(this.state.values, (error) => {
        if (error) {
          alertify.error("Error Changing Password:" + error);
        }
        else {
          alertify.success("Password Changed");
          window.location.hash = "/search";
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
      <div style={{width: '800px'}}>
        <FormTable onSubmit={this.changePassword}>
          <tr><td colSpan="100%"><h3>Change Password</h3></td></tr>
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
            label="Old Password" id="oldPassword"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldInput
            inputType="password"
            label="New Password" id="newPassword"
            data={values}
            placeholder="Password - At least 7 characters"
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldSubmit label="Submit" onClick={this.changePassword}/>
        </FormTable>
      </div>
    );

  },
});

module.exports = ChangeUserPassword;
