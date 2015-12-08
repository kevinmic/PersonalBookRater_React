var FormValidationMixins = {
  isValid: function(id) {
      var {values, required} = this.state;
      if (required[id] && required[id](values) && values[id] == "") {
        return false;
      }
      return true;
  },
  validateAllRequiredFields: function() {
    var isValid = true;
    Object.keys(this.state.required).map((key) => {
      if (!this.isValid(key)) {
        isValid = false;
      }
    });
    return isValid;
  },
  onChange: function(prop, valid) {
    var data = {values:{...this.state.values}};
    data.values[prop.target.id] = prop.target.value;
    // data.formValid[prop.target.id] = valid;
    this.setState(data);
  },
  onChangeWithValue: function(id, value, valid) {
    var data = {values:{...this.state.values}};
    data.values[id] = value;
    // data.formValid[id] = valid;
    this.setState(data);
  },
}

module.exports = FormValidationMixins;
