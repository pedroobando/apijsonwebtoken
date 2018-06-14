import {Router} from 'express';
import {User} from '../models/User';
import * as jwt from 'jsonwebtoken';
import {verifyToken} from '../accesstoken';

export const users = Router();

users.post('/authenticate', async (req, res, next) => {
  try {
    const user = await User.scope(req.query['scope']).findOne({where: {login: req.body.login}});
    // console.log(`Usuario: ${user.login}`);
    if (!user) {
      res.status(401).json({
        success: true,
        message: 'Autenticacion fallida. Usuario no encontrado',
        token: null
      });
      console.log(`User failed`);
      next();
    }

    if (user && user.password !== req.body.password) {
      res.status(401).json({
        success: false,
        message: 'Autenticacion fallida. Password erroneo',
        token: null
      });
      console.log(`User failed`);
    } else {
      // const expToken = Math.floor(Date.now() / 1000) + (2 * 60);
      jwt.sign({user}, req.app.get('superSecret'), { expiresIn: 2 * 60 }, (err, token) => {
        res.status(202).json({
          success: true,
          message: 'Disfruta tu token.',
          token
        });
      });
      console.log(`User success`);
    }
  } catch (e) {
    next(e);
  }
});

users.post('/', verifyToken, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      object: user
    });
    console.log(`User sucess`);
  } catch (e) {
    next(e);
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
