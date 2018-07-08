import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Promise } from 'bluebird';

export function createToken(user) {
  try {
    const payload = {
      sub: user.login,
      iat: moment().unix(),
      exp: moment().add(1, 'hour').unix()
    };
    return jwt.sign(payload, 'p4l4br4S3cr3t4');
  } catch (error) {
    return error.message;
  }
}

export function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      if (typeof token === "undefined") {
        reject({
          statusCode: 403,
          success: false,
          message: 'Autenticacion fallida. No tiene autorización para acceder al sitio..',
        });
      }
      jwt.verify(token, 'p4l4br4S3cr3t4', (err, payload) => {
        if (err) {
          reject({
            statusCode: 403,
            success: false,
            message: 'Autenticacion fallida. No tiene autorización para acceder al sitio...',
          });
        }
        if (payload.exp <= moment().unix()) {
          reject({
            statusCode: 401,
            success: false,
            message: 'Autenticacion fallida. No tiene autorización para acceder al sitio, ha vencido el tiempo de seccion.'
          });
        }
        resolve({
          statusCode: 202,
          success: true,
          message: 'Autenticacion exitosa. Tiene autorización para acceder al sitio.',
          resolve: payload.sub
        });
      });

    } catch (error) {
      reject({
        statusCode: 500,
        success: false,
        message: 'Invalid Token'
      });
    }
  });
  return decoded;
}

export function isAuth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: 'Autenticacion fallida. No tiene autorización para acceder al sitio.'
      });
      return;
    }
    const token: string = req.headers['authorization'].split(" ")[1];
    decodeToken(token)
      .then(response => {
        req.user = response;
        next();
      })
      .catch(response => {
        res.status(response.statusCode).json({
          success: response.success,
          message: response.message
        });
      });

  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    });
  }
}
