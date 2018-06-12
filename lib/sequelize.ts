import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dist/dev-db.sqlite3',
  operatorsAliases: Sequelize.Op as any,
  database: 'movies',
  username: 'root',
  password: '',
  modelPaths: [__dirname + '/models']
});
