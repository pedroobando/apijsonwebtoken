import {User} from '../models/User';
import {createToken} from '../services';

export const singUp = async (req, res, next) => {
  try {    
    const user = await User.create(req.body);
    return {
      statusCode: 201,
      success: true,
      user: {
        id: user.id,
        login: user.login,
        fullName: user.fullName,
        role: user.role,
        token: createToken(user)
      },
      message: `User ${user.fullName} has created`
    };
  } catch (e) {
    next({
      statusCode: e.statusCode,
      success: false,
      message: `Error in ${e.message} - controllers - users/singUp`,
      user: {}
    });
  }
}

export const singIn = async (req, res, next) => {
  try {
    let retValObject: object = [];
    // console.log(req.body.login);
    await User.scope(req.query['scope']).findOne({where: {login: req.body.login}}).then(user => {
      // if (!user) {
      //   retValObject = {
      //     statusCode: 404,
      //     success: false,
      //     message: 'Autenticacion fallida. Usuario no encontrado',
      //     user: {}
      //   };
      // }

      if (user && user.password !== req.body.password) {
        retValObject = {
          statusCode: 401,
          success: false,
          message: 'Autenticacion fallida. Password no coinciden con el usuario',
          // user: {}
        };        
      } else {
        retValObject = {
          statusCode: 202,
          success: true,
          message: 'Disfruta tu token.',
          token: createToken(user)
        };        
      }
    }).catch(err => {
      retValObject = {
        statusCode: 404,
        success: false,
        message: 'Autenticacion fallida. Verifique el usuario',
        // user: {},
        token: ''
      };
    });
    return retValObject;
  } catch (e) {
    next({
      statusCode: e.statusCode,
      success: false,
      message: `Error in ${e.message} - controllers - users/singIn`,
      // user: {}
    });
  }
}
