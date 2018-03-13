import User from '../models/users.model';
import bcrypt from 'bcrypt';
import errors from '@feathersjs/errors';
import logger from '../config/logger';
import { generateJWT } from '../utils';
import jwt from 'jsonwebtoken';

/**
 * Login user
 */
function login(req, res, next) {
  // get username and password from req.body
  const { username, password: plainPassword, token } = req.body;
  let userId;
  let response;
    User.findByUsername(username)
      .then(user => {
        response = { user };
        userId = user._id;
        return user.compareBcryptPassword(plainPassword, user.password)
      })
      .then(() => generateJWT(userId))
      .then((token) => {
        response = { ... response, token };
        res.status(200).json(response);
      })
      .catch(err => next(err))
}

export default { login };
