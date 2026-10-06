const validatorService = {
  required(value) {
    return value !== "";
  },

  email(value) {
    return /\S+@\S+\.\S+/.test(value);
  },

  usn(value) {
    return value.length >= 8;
  },

  phone(value) {
    return /^[0-9]{10}$/.test(value);
  },
};

export default validatorService;