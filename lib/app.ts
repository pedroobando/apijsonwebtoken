import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'strong-error-handler';

import * as morgan from 'morgan';
// import * as jwt from 'jsonwebtoken';

import {movies} from './routes/movies';
import {actors} from './routes/actors';
import {users} from './routes/users';

export const app = express();

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: '5mb'}));

// muestra las rutas en la consola
app.use(morgan('dev'));

app.set('superSecret', 'p4l4br4S3cr3t4');

// enable corse for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "x-total-count");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
  // res.header("Access-Control-Allow-Headers", "Content-Type,x-access-token");
  next();
});

app.use('/movies', movies);
app.use('/actors', actors);
app.use('/users', users);

app.use(errorhandler({
  debug: process.env.ENV !== 'prod',
  log: true,
}));
