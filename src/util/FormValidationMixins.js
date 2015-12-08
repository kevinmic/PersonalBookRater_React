var FormValidationMixins = {
  isValid: function(id, ignoreShowError) {
      var {values, required, showError} = this.state;

      if (showError || ignoreShowError) {
        if (required[id] && required[id](values) && values[id] == "") {
          return false;
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

  onChangeWithValue: function(id, value) {
    var data = {values:{...this.state.values}};
    data.values[id] = value;
    // console.log("CHANGED With Value - ", id, value, data.values);
    // data.formValid[id] = valid;
    this.setState(data);
  },
}

module.exports = FormValidationMixins;
