import {Router} from 'express';
import {Actor} from '../models/Actor';
import {MovieActor} from '../models/MovieActor';
import * as jwt from 'jsonwebtoken';

export const actors = Router();

actors.use((req, res, next) => {
  // x-access-token: token , /api?token=token, form body
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Error al autenticar el token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
});

actors.post('/', async (req, res, next) => {
  try {
    const actor = await Actor.create(req.body);
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

actors.put('/:id', async (req, res, next) => {
  try {
    await Actor.update(req.body, {where: {id: req.params['id']}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
