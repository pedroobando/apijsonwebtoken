import * as jwt from 'jsonwebtoken';

// Verify Token
export function verifyToken(req, res, next) {
  try {
    // Obtiene el valor de la auth en la cabezera
    const token: string = req.body.token || req.query.token || req.headers['x-access-token'];
    if (typeof token !== "undefined") {
      jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
        if (err) {
          res.status(403).json({
            success: false,
            message: 'Token Errado.',
          });
        } else {
          req.token = decoded;
          console.log(req.token);
          next();
        }
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Token inexistente.',
      });
    }
  } catch (err) {
    next(err);
  }
}
