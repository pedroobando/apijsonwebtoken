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

// users.post('/authenticate', async (req, res, next) => {
//   try {
//     const user = await User.scope(req.query['scope']).findOne({where: {login: req.body.login}});
//     // console.log(`Usuario: ${user.login}`);
//     if (!user) {
//       res.status(401).json({
//         success: true,
//         message: 'Autenticacion fallida. Usuario no encontrado',
//         token: null
//       });
//       console.log(`User failed`);
//       next();
//     }

//     if (user && user.password !== req.body.password) {
//       res.status(401).json({
//         success: false,
//         message: 'Autenticacion fallida. Password erroneo',
//         token: null
//       });
//       console.log(`User failed`);
//     } else {
//       jwt.sign({user}, req.app.get('superSecret'), (err, token) => {
//         res.status(202).json({
//           success: true,
//           message: 'Disfruta tu token',
//           token
//         });
//       });
//       console.log(`User success`);
//     }

//   } catch (e) {
//     next(e);
//   }
// });

// export function authenticate(req, res, next) {
//   try {
//     // const token: string = req.body.token || req.query.token || req.headers['x-access-token'];
//     const userlogin = req.body.login || req.query.login || req.headers['x-access-login'];
//     const userpassword = req.body.password || req.query.password || req.headers['x-access-password'];
//     // console.log(`Usuario: ${user.login}`);
//     if (!userlogin) {
//       res.status(401).json({
//         success: true,
//         message: 'Autenticacion fallida. Usuario no encontrado',
//         token: null
//       });
//       console.log(`User failed`);
//       next();
//     }

//     if (userlogin && userpassword !== req.body.password) {
//       res.status(401).json({
//         success: false,
//         message: 'Autenticacion fallida. Password erroneo',
//         token: null
//       });
//       console.log(`User failed`);
//     } else {
//       jwt.sign({user}, req.app.get('superSecret'), (err, token) => {
//         res.status(202).json({
//           success: true,
//           message: 'Disfruta tu token',
//           token
//         });
//       });
//       console.log(`User success`);
//     }

//   } catch (e) {
//     next(e);
//   }
// }
