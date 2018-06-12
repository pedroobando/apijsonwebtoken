import {Model, Column, Table, CreatedAt, UpdatedAt} from "sequelize-typescript";
//  BelongsToMany, Scopes,
// import {Movie} from "./Movie";
// import {MovieActor} from "./MovieActor";

// @Scopes({
//   movies: {
//     include: [
//       {
//         model: () => Movie,
//         through: {attributes: []},
//       },
//     ],
//   },
// })
@Table
export class User extends Model<User> {
  @Column
  login: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  role: string;

  @Column
  token: string;

  // @BelongsToMany(() => Movie, () => MovieActor)
  // movies?: Movie[];

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  static scope(...args: any[]): typeof User {
    args[0] = args[0] || 'defaultScope';
    return super.scope.call(this, ...args);
  }
}
