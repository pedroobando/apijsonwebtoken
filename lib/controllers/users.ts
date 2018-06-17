import {User} from '../models/User';
import {createToken} from '../services';

export const signUp = async (req, res, next) => {
  try {
    // console.info(req.body.login.toString().toLowerCase().trim());
    const _login =  req.body.login.toString().replace(/ /gi, '').toLowerCase().trim();
    const _password = req.body.password.toString().trim();
    const _fullName = req.body.fullName.toString();

    const newUser = {
      login: _login,
      password: _password,
      fullName: _fullName
    };
    if (newUser.login.toString().length <= 4) {
      return {
        statusCode: 402,
        success: false,
        message: `Usuario no creado, el dato login es menor que cinco (5).`
      };
    }
    if (newUser.password.toString().length <= 3) {
      return {
        statusCode: 402,
        success: false,
        message: `Usuario no creado, el dato password es menor que cuatro (4).`
      };
    }

    // const user = await User.create(req.body);
    const user = await User.create(newUser);
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
      message: `Usuario ${user.fullName} fue crerado exitosamente.`
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

export const signIn = async (req, res, next) => {
  try {
    let retValObject: object = [];
    await User.scope(req.query['scope']).findOne({where: {login: req.body.login}}).then(user => {
      if (!user) {
        retValObject = {
          statusCode: 401,
          success: false,
          message: 'Autenticacion fallida. Error en login o acceso del usuario.',
          // user: {}
        };          
      } else if (user && user.password !== req.body.password) {
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
          message: 'Autenticacion exitosa. Te has logueado correctamente.',
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
    });
  }
}
