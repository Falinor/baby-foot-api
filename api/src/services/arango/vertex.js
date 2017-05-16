import graph from './index';
import emitter from './emitter';

export const createVertex = (name) => {
  console.log(`Creating vertex collection ${name}.`);
  const Vertex = graph.vertexCollection(name);
  emitter.once('initCollections', () => {
    // Retrieve vertex collection
    Vertex.get()
      .then(() => {
        // It exists
        console.log(`Vertex collection '${name}' exists. Skipping...`);
        emitter.emit('endInitCollection');
      })
      .catch(() => {
        // Vertex collection does not exist so we create it
        graph.addVertexCollection(name)
          .then(() => {
            console.log(`Vertex collection '${name}' created.`);
            emitter.emit('endInitCollection');
          })
          .catch(console.error);
      });
  });
  return Vertex;
};
