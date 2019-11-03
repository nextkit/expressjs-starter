import bcrypt from 'bcrypt';
import mongoose, { Document, HookNextFunction, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  emailValid: () => Promise<boolean>;
  usernameValid: () => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  created: { type: Date, default: () => Date.now() },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

/**
 * Hook on "save".
 */
UserSchema.pre<IUser>('save', function(next: HookNextFunction) {
  // Hash password.
  bcrypt.hash(this.password, Number(process.env.SALT_ROUND) || 12).then((hash: string) => {
    this.password = hash;
    next();
  });
});

/**
 * Checks if username is already used.
 *
 * @returns {Promise<boolean>}
 */
UserSchema.methods.usernameValid = async function(): Promise<boolean> {
  const regexp = new RegExp(this.username, 'i');

  const docs = await User.find({ username: regexp });
  return docs.length === 0;
};

/**
 * Checks if email is already used.
 *
 * @returns {Promise<boolean>}
 */
UserSchema.methods.emailValid = async function(): Promise<boolean> {
  const regexp = new RegExp(this.email, 'i');

  const docs = await User.find({ email: regexp });
  return docs.length === 0;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
