import mongoose from 'mongoose';
import logError, { logMessage } from '../../utils/log';

// TODO: move to its own file
const userSchema = new mongoose.Schema({
  id: Number,
});
const User = mongoose.model('User', userSchema);

export const addUser = async (telegramUser) => {
  const newUser = {
    id: telegramUser.id,
  };

  try {
    await User.findOneAndUpdate(
      { id: telegramUser.id },
      { $setOnInsert: newUser },
      { upsert: true },
    );
  } catch (err) {
    logError(err);
  }
};

export const addUserOptIn = (user, group) => {};

export default {
  addUser,
  addUserOptIn,
};
