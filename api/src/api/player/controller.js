import { success } from '../../services/response';
import Player from './model';

export const create = ({ bodymen: { body } }, res, next) =>
  Player.save(body)
    .then(success(res, 201))
    .catch(next);
