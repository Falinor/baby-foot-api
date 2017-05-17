import graph from './index';

export const createVertexCollection = (name) => {
  console.log(`Creating vertex collection '${name}'...`);
  const Vertex = graph.vertexCollection(name);

  // Add eventual methods we would like to use
  // in GraphVertexCollection instances.
  // HERE

  return new Promise((resolve, reject) => {
    // Retrieve vertex collection
    Vertex.get()
      .then(() => {
        // It exists
        console.log(`Vertex collection '${name}' exists. Skipping...`);
        resolve(Vertex);
      })
      .catch(() => {
        // Vertex collection does not exist so we create it
        graph.addVertexCollection(name)
          .then(() => {
            console.log(`Vertex collection '${name}' created.`);
            resolve(Vertex);
          })
          .catch(reject);
      });
  })
};
