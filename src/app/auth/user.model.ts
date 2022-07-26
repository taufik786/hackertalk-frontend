export class User {
  constructor(
    public name: String,
    public email: String,
    public verified: Boolean,
    public createdAt: String,
    public _token: String,
    public _tokenExpiresInDate: Date,
  ) { }

  get token() {
    if (!this._tokenExpiresInDate || new Date() > this._tokenExpiresInDate) {
      return null;
    }
    return this._token;
  }
}
