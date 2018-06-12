import {Router} from 'express';
import {User} from '../models/User';
// import {MovieUser} from '../models/MovieUser';

export const users = Router();

users.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
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
