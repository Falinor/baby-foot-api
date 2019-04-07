import { createMemoryRepository } from './memory-repository';
import { createMatchRepository as createMongodbRepository } from './mongodb-repository';

const adapters = ['memory', 'mongodb'];
const adapterMap = {
  memory: createMemoryRepository,
  mongodb: createMongodbRepository,
};

export default function createMatchRepository(adapter = 'memory') {
  if (!adapter || !adapters.includes(adapter))
    throw new Error(
      `Cannot find this database adapter. Must be one of ${adapters}`,
    );

  return adapterMap[adapter];
}
