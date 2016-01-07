import React from 'react';
var PropTypes = React.PropTypes;
import libraryIMG from './images/Library.jpg';

import {AutoSuggestFormField, FormField, FormTable, FormFieldSubmit, FormFieldInput, stopEnterSubmitting} from './util/FormFieldTable';
import FormValidationMixins from './util/FormValidationMixins';
import firebaseInfo from '../config/firebase-info.js';
import {GoToLastSearch} from './util/GoToHelper';

const loginStyle = {
  width:'300px',
  height:'150px',
  position:'absolute',
  top:'45%',
  marginTop:'50%',
  marginTop:'-50px',
  left:'50%',
  marginLeft:'-150px',
};

const loginWhiteStyle = {
  position:'absolute',
  top:'50%',
  marginTop:'-100px',
  height:'200px',
  width:'100%',
  backgroundColor: 'rgba(256, 256, 256, 0.5)',
}

var Login = React.createClass({
  mixins: [FormValidationMixins],
  getDefaultProps: function() {
    return {
      redirect: true,
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
            GoToLastSearch();
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

    return (
      <div>
        <div style={{width:'100%',overflow:'hidden'}} >
          <img src={libraryIMG} width="100%" min-width="700px"/>
        </div>
        <div style={loginWhiteStyle}>
          <div style={loginStyle}>
            <FormTable allowEnter={true} onSubmit={this.login}>
              <FormFieldInput
                id="email"
                showLabel={false}
                placeholder="Email"
                data={values}
                onChange={this.onChange}
                isValid={this.isValid}
                />
              <FormFieldInput
                id="password"
                showLabel={false}
                placeholder="Password"
                inputType="password"
                data={values}
                onChange={this.onChange}
                isValid={this.isValid}
                />
              <FormFieldSubmit label="Login" showLabel={false} btnStyle={{backgroundColor:'#344c2d', color:'#FFFFFF'}} onClick={this.login}/>
            </FormTable>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Login;
