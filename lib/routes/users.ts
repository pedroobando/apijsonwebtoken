import {Router} from 'express';
import {User} from '../models/User';
import {verifyToken} from '../accesstoken';
// import * as vef from '../accesstoken';

import * as userControllers from '../controllers/users';

export const users = Router();

users.post('/singup', async (req, res, next) => {
  try {
    const singUp = userControllers.singUp(req, res, next);
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

users.post('/singin', async (req, res, next) => {
  try {
    const singIn = userControllers.singIn(req, res, next);
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
