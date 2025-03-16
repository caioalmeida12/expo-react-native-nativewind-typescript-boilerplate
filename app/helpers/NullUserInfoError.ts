class NullUserInfoError extends Error {
  constructor(message: string = "User information is null or undefined") {
    super(message);
    this.name = "NullUserInfoError";

    // This line is needed for proper stack traces in TypeScript
    Object.setPrototypeOf(this, NullUserInfoError.prototype);
  }
}

export default NullUserInfoError;
