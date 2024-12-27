import User from '../models/User.js';
import { curdRepository } from './curdRepository.js';

export const userRepository = {
  ...curdRepository(User)
};
