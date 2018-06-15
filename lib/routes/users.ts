import {Router} from 'express';
import {User} from '../models/User';
import {verifyToken} from '../accesstoken';

import * as userControllers from '../controllers/users';
export const users = Router();

users.post('/signup', async (req, res, next) => {
  try {
    let _errDatosFaltantes: string = `Usuario no creado indique lo(s) dato(s)`;
    // Si no presenta el login
    if (typeof req.body.login === 'undefined') {
      _errDatosFaltantes += ' login';
    }
    // Si no presenta el password
    if (typeof req.body.password === 'undefined') {
      _errDatosFaltantes += ' password';
    }
    // Si no presenta el fullName
    if (typeof req.body.fullName === 'undefined') {
      _errDatosFaltantes += ' fullName';
    }
    if (typeof req.body.role === 'undefined') {
      _errDatosFaltantes += ' role';
    }
    _errDatosFaltantes += ' del usuario.';
    if (_errDatosFaltantes.length >= 53) {
      return res.status(400).json({
        success: false,
        message: _errDatosFaltantes + ` total ${_errDatosFaltantes.length}`
      });
    }

    const singUp = userControllers.signUp(req, res, next);
    singUp.then(resultado => {
      res.status(resultado.statusCode).json({
        success: resultado.success,
        activeUser: resultado.user,
        message: resultado.message
      });
      // console.log(resultado);
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `Error in ${error.message}`
    });
  }
});

users.post('/signin', async (req, res, next) => {
  try {
    const singIn = userControllers.signIn(req, res, next);
    singIn.then(resultado => {
      res.status(resultado.statusCode).json({
        success: resultado.success,
        activeUser: resultado.user,
        message: resultado.message,
        token: resultado.token
      });
      // console.log(resultado);
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `Error in ${error.message}`
    });
  }
});

users.get('', async (req, res, next) => {
  try {
    res.json(await User.scope(req.query['scope']).findAll());
  } catch (e) {
    next(e);
  }
});

users.get('/:id', async (req, res, next) => {
  try {
    const user = await User.scope(req.query['scope']).findById(req.params['id']);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

users.put('/:id', verifyToken, async (req, res, next) => {
  try {
    await User.update(req.body, {where: {id: req.params['id']}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
