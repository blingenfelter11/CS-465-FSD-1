const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1'
const dbURI = 'mongodb://${host}/travlr';
const readLine = require('readline');

// avoid 'current Server Discovery and Monitoring engine is deprecated'
//mongoose.set('useUnifiedTopology', true);

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useCreateIndex: true
    }), 1000);
}

mongoose.connection.on('connected', () => {
    console.log('connected');
});
mongoose.connection.on('error', err => {
    console.log('error', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
});



  
  const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
      console.log('Mongoose disconnected through ${msg}');
      callback();
    });
  };
  
  // For nodemon restarts                                 
  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  // For app termination
  process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
      process.exit(0);
    });
  });
  // For Heroku app termination
  process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
      process.exit(0);
    });
  });

  connect();
  
  require('./travlr');