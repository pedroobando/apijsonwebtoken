import {Router} from 'express';
import {Actor} from '../models/Actor';
import {MovieActor} from '../models/MovieActor';
import { isAuth } from '../services';

export const actors = Router();

actors.post('/', isAuth, async (req, res, next) => {
  try {
    const actor = await Actor.create<Actor>(req.body);
    res.status(201).json(actor);
  } catch (e) {
    next(e);
  }
});

actors.post('/:id/movies/:movieId', async (req, res, next) => {
  try {
    await MovieActor.create({
      actorId: req.params['id'], movieId: req.params['movieId']
    });
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

actors.get('', async (req, res, next) => {
  try {
    res.json(await Actor.scope(req.query['scope']).findAll());
  } catch (e) {
    next(e);
  }
});

actors.get('/:id', async (req, res, next) => {
  try {
    const actor = await Actor.scope(req.query['scope']).findById(req.params['id']);
    res.json(actor);
  } catch (e) {
    next(e);
  }
});

actors.put('/:id', isAuth, async (req, res, next) => {
  try {
    await Actor.update<Actor>(req.body, {where: {id: req.params['id']}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
