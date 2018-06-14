import {Router} from 'express';
import {User} from '../models/User';
import * as jwt from 'jsonwebtoken';
// import {MovieUser} from '../models/MovieUser';

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
    
    if (user) {
      if (user.password !== req.body.password) {
        res.status(401).json({
          success: false,
          message: 'Autenticacion fallida. Password erroneo',
          token: null
        });        
        console.log(`User failed`);
      } else {
        const gettoken = jwt.sign({user}, req.app.get('superSecret'));
        res.status(202).json({
          success: true,
          message: 'Disfruta tu token',
          token: gettoken
        });
        console.log(`User success`);
      }
    }
    
  } catch (e) {
    next(e);
  }
});

users.post('/', async (req, res, next) => {
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

// Users.post('/:id/movies/:movieId', async (req, res, next) => {
//   try {
//     await MovieUser.create({
//       UserId: req.params['id'], movieId: req.params['movieId']
//     });
//     res.sendStatus(200);
//   } catch (e) {
//     next(e);
//   }
// });

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

users.put('/:id', async (req, res, next) => {
  try {
    await User.update(req.body, {where: {id: req.params['id']}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
