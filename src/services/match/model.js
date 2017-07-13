import model, { find, findOne, save, vertex } from '../../components/model';

export { find, findOne, save, vertex };

export default (store) => model(store);
