import React from 'react';
import PropTypes from 'prop-types';
import alertify from 'alertifyjs';
import _ from 'lodash';
import firebase from 'firebase';

import FormValidationMixins from '../util/FormValidationMixins';
import {AutoSuggestFormField, FormFieldCheckBox, FormField, FormFieldSubmit, FormTable, FormFieldInput, stopEnterSubmitting} from '../util/FormFieldTable';
import TableStyles from '../styles/TableStyles';

const INITIAL_VALUES = {
  name:"",
  email:"",
  password:"",
  role_reviews: true,
  role_books: true,
  role_editbooks: false,
  role_users: false,
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class AddUser extends React.Component{
  static propTypes = {
    auth : PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      showError: false,
      values: _.cloneDeep(INITIAL_VALUES),
      required: {
        name: () => true,
        email: () => true,
        password: () => true,
      },
      validators: {
        name: (pwd) => pwd && pwd.length > 3,
        email: validateEmail,
        password: (pwd) => pwd && pwd.length > 6,
      }
    };

    FormValidationMixins.addAndBind(this);
  }

  addUser = () => {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var {email, password, name, role_reviews, role_books, role_editbooks, role_users} = this.state.values;
      var firebaseRef = firebase.database().ref('/users');
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
          var roles = {};
          if (role_reviews) {
            roles.reviews = true;
          }
          if (role_books) {
            roles.books = true;
          }
          if (role_editbooks) {
            roles.editbooks = true;
          }
          if (role_users) {
            roles.users= true;
          }
          var user = {name: name, roles: roles};

          firebaseRef.child(successInfo.uid).set(user, (error) => {
            if (error) {
              alertify.error("Login created, but user data was not saved. aka: talk to Kevin");
            }
            else {
              alertify.success("User:" + email + " Created");
              this.setState({values:_.cloneDeep(INITIAL_VALUES)});
            }
          });
        }
      });
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
        <FormTable onSubmit={this.addBook}>
          <tr><td colSpan="100%"><h3>User Data</h3></td></tr>
          <FormFieldInput
            label="Name" id="name"
            data={values}
            placeholder="This name will be shown on reviews"
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <tr><td colSpan="100%"><h3>Permissions</h3></td></tr>
          <FormFieldCheckBox
            label="Review Books" id="role_reviews"
            data={values}
            onChange={this.onCheckboxChange}
            isValid={this.isValid}
            >
            <span style={{color:'grey'}}> (This User can Create and Edit their own reviews)</span>
          </FormFieldCheckBox>
          <FormFieldCheckBox
            label="Create Books" id="role_books"
            data={values}
            onChange={this.onCheckboxChange}
            isValid={this.isValid}
            >
            <span style={{color:'grey'}}> (This User can Create Books)</span>
          </FormFieldCheckBox>
          <FormFieldCheckBox
            label="Create/Edit/Delete Books" id="role_editbooks"
            data={values}
            onChange={this.onCheckboxChange}
            isValid={this.isValid}
            >
            <span style={{color:'grey'}}> (This User can Create, Edit, and Delete any book)</span>
          </FormFieldCheckBox>
          <FormFieldCheckBox
            label="Create Users" id="role_users"
            data={values}
            onChange={this.onCheckboxChange}
            isValid={this.isValid}
            >
            <span style={{color:'grey'}}> (This User can create other Users and change permissions for users)</span>
          </FormFieldCheckBox>
          <tr><td colSpan="100%"><h3>Login</h3></td></tr>
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
            placeholder="Password - At least 7 characters"
            onChange={this.onChange}
            isValid={this.isValid}
            />
          <FormFieldSubmit label="Submit" onClick={this.addUser}/>
        </FormTable>
      </div>
    );
  }
};

export default AddUser;
