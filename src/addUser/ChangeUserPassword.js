import React from 'react';
import PropTypes from 'prop-types';
import alertify from 'alertifyjs';
import firebase from 'firebase/app';
import 'firebase/auth';

import FormValidationMixins from '../util/FormValidationMixins';
import {FormFieldSubmit, FormTable, FormFieldInput} from '../util/FormFieldTable';
import {GoToLastSearch} from '../util/GoToHelper';

class ChangeUserPassword extends React.Component{
  static propTypes = {
    auth : PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      showError: false,
      values: {
        email: this.props.auth.username,
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

    FormValidationMixins.addAndBind(this);
  }

  changePassword = () => {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      firebase.auth().signInWithEmailAndPassword(this.state.values.email, this.state.values.oldPassword)
        .then(user => {
          firebase.auth().currentUser.updatePassword(this.state.values.newPassword)
          .then(() => {
            alertify.success("Password Changed");
            GoToLastSearch()
          })
          .catch(error => alertify.error("Error Changing Password:" + error));
        })
        .catch(error => alertify.error("Error Changing Password:" + error));
    }
    else {
      this.setState({showError:true});
    }

  }

  render() {
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
  }
};

export default ChangeUserPassword;
