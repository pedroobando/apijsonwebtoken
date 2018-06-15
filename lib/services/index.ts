// import {User} from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

export function createToken(user) {
  const payload = {
    sub: user.login,
    iat: moment().unix(),
    exp: moment().add(1, 'hour').unix()
  };

  return jwt.sign(payload, 'p4l4br4S3cr3t4');
}

export function isAuth(req, res, next) {

}
