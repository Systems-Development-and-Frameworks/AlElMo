import bcrypt from 'bcrypt';

const salt = 9;

export default class User {
  constructor(data, id) {
    const { name, email, password } = data;
    if (name && id !== undefined) {
      this.id = null;
      this.name = null;
      this.email = null;
      this.password = null;
      this.setId(id).setName(name).setPassword(password).setEmail(email);
    } else {
      const error = new Error(`A User was instantiated with malformed data: ${data}`);
      error.name = 'IllegalArgumentException';
      throw error;
    }
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setPassword(password) {
    this.password = bcrypt.hashSync(password, salt);
    return this;
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}
