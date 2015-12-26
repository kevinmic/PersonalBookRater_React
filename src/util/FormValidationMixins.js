var FormValidationMixins = {
  isValid: function(id, ignoreShowError) {
      var {values, required, showError, validators} = this.state;

      if (showError || ignoreShowError) {
        if (required[id] && required[id](values)) {
          if (!values[id] || (validators && validators[id] && !validators[id](values[id]))) {
            return false;
          }
        }
      }
      return true;
  },

  validateAllRequiredFields: function() {
    var isValid = true;
    Object.keys(this.state.required).map((key) => {
      if (!this.isValid(key, true)) {
        isValid = false;
      }
    });
    return isValid;
  },

  onChange: function(prop, valid) {
    // console.log("onChange");
    this.onChangeWithValue(prop.target.id, prop.target.value);
  },

  onCheckboxChange: function(prop, valid) {
    // console.log("onCheckboxChange");
    this.onChangeWithValue(prop.target.id, prop.target.checked);
  },

  onChangeWithValue: function(id, value) {
    // console.log("CHANGED With Value - ", id, value);
    var data = {values:{...this.state.values}};
    data.values[id] = value;
    // data.formValid[id] = valid;
    this.setState(data);
  },
}

module.exports = FormValidationMixins;
