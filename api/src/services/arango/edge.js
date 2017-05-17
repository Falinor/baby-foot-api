import graph from './index';

export const createEdge = (name, fromName, toName) => {
  console.log(`Creating edge collection '${name}'...`);
  const Edge = graph.edgeCollection(name);
  const def = {
    collection: name,
    from: [fromName],
    to: [toName]
  };

  // Add eventual methods we would like to use
  // in GraphEdgeCollection instances.
  // HERE

  return new Promise((resolve, reject) => {
    Edge.get()
      .then(() => {
        // It exists
        console.log(`Edge collection '${name}' exists. Skipping...`);
        resolve(Edge);
      })
      .catch(() => {
        // Edge collection does not exist so we create it
        graph.addEdgeDefinition(def)
          .then(() => {
            console.log(`Edge collection '${name}' created.`)
            resolve(Edge);
          })
          .catch(reject);
      });
  });
};
