import mongoose from 'mongoose';
import { mongodb } from '../../config/mongodb-config';
import * as log from '../../utils/log';

function prepareConnectionString(config) {
  let connectionString = 'mongodb://';

  if (config.user) {
    connectionString += `${config.user}:${config.password}@`;
  }

  connectionString += `${config.server}/${config.database}`;

  return connectionString;
}

function init() {
  const options = {};
  const connectionString = prepareConnectionString(mongodb);

  mongoose.connect(connectionString, options)
    .then((result) => {
      log.logMessage(`MongoDB connection successful. DB: ${connectionString} - result: ${result}`);
    })
    .catch((error) => {
      log.logError(`Error occurred while connecting to DB ${connectionString}: ${error}`);
    });
}

export default init;
