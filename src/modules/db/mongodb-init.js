import mongoose from 'mongoose';
import * as log from 'utils/log';

// mongoose.set('useFindAndModify', false);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useCreateIndex', true);

const prepareConnectionString = (config) => {
  let connectionString = 'mongodb://';

  if (config.user) {
    connectionString += `${config.user}:${config.password}@`;
  }

  connectionString += `${config.server}/${config.database}`;

  return connectionString;
};

export const init = () => {
  const options = {};
  const mongodb = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    server: process.env.MONGO_SERVER,
    database: process.env.MONGO_DATABASE,
  };
  const connectionString = prepareConnectionString(mongodb);

  mongoose
    .connect(connectionString, options)
    .then(() => {
      log.logMessage(`MongoDB connection successful. DB: ${connectionString}`);
    })
    .catch((error) => {
      log.logError(
        `Error occurred while connecting to DB ${connectionString}: ${error}`,
      );
    });
};
