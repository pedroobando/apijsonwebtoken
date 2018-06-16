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

// const token: string = req.body.token || req.query.token || req.headers['x-access-token'];
// if (typeof token !== "undefined") {
//   jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
//     if (err) {
//       res.status(403).json({
//         success: false,
//         message: 'Token Errado.',
//       });
//     } else {
//       req.token = decoded;
//       console.log(req.token);
//       next();
//     }
//   });
// } else {
//   res.status(403).json({
//     success: false,
//     message: 'Token inexistente.',
//   });
// }

export function isAuth(req, res, next) {
  // req.body.token.split(" ")[1] || req.query.token.split(" ")[1] ||
  const token: string = req.headers['authorization'].split(" ")[1];
  if (typeof token === "undefined") {
    return res.status(403).json({
      message: 'No tiene autorización.'
    });
  }

  jwt.verify(token, 'p4l4br4S3cr3t4', (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: 'Token Errado.',
      });
    } else if (decoded.exp <= moment().unix()) {
      return res.status(401).json({
        message: 'El token ha expirado.'
      });
    } else {
      req.user = decoded.sub;
      // console.log(req.token);
      next();
    }
  });

  // const token = req.headers.authorization.split(" ")[1];
  // const payload = jwt.decode(token, 'p4l4br4S3cr3t4');



  // req.user = payload.sub;
  next();
}
