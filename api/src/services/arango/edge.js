import graph from './index';
import emitter from './emitter';

export const createEdge = (name, fromName, toName) => {
  console.log(`Creating edge collection ${name}.`);
  const Edge = graph.edgeCollection(name);
  emitter.once('initCollections', () => {
    Edge.get()
      .then(() => {
        console.log(`Edge collection '${name}' exists. Skipping...`);
        emitter.emit('endInitCollection');
      })
      .catch(() => {
        graph.addEdgeDefinition({
          collection: name,
          from: [fromName],
          to: [toName]
        }).then(() => {
          console.log(`Edge collection '${name}' created.`);
          emitter.emit('endInitCollection');
        }).catch(console.error);
      });
  });
  return Edge;
};
