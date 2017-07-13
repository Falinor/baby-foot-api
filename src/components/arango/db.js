import { Database as Server } from 'arangojs';

import logger from '../logger';
import { config } from '../../config';

/**
 * Usage:
 * ```
 * const db = new Db();
 * await db.init();
 * ```
 */
export class Db {
  constructor(options = config.db) {
    options.url = `${options.host}:${options.port}`;
    this.options = options;
    this.server = new Server(options.url);
  }

  async clean(dropCollection = true) {
    return this.graph.drop(dropCollection);
  }

  async init() {
    await this._initDb();
    this.server.useDatabase(this.options.databaseName);
    await this._initGraph();
    await this._initCollections();
    await this._initIndexes();
    return this.graph;
  }

  async _initDb() {
    try {
      await this.server.createDatabase(this.options.databaseName, [
        { username: this.options.username, password: this.options.password }
      ]);
    } catch (e) {
      if (e.code === 409) {
        logger.info(`Database '${this.options.databaseName}' already exists. Skipping...`);
      } else {
        logger.error(e);
      }
    }
  }

  async _initGraph() {
    try {
      await this.graph.create({});
      logger.info(`Graph '${this.options.graphName}' created.`);
    } catch (e) {
      if (e.code === 409) {
        logger.info(`Graph '${this.options.graphName}' already exists. Skipping...`);
      } else {
        logger.error(e);
      }
    }
  }

  async _initCollections() {
    return Promise.all([
      this._createVertexCollection('matches'),
      this._createVertexCollection('teams'),
      this._createVertexCollection('players'),
      this._createEdgeCollection('played', 'teams', 'matches'),
      this._createEdgeCollection('memberOf', 'players', 'teams')
    ]);
  }

  async _initIndexes() {
    const matches = this.graph.vertexCollection('matches');
    const teams = this.graph.vertexCollection('teams');
    const players = this.graph.vertexCollection('players');
    return Promise.all([
      matches.createSkipList(['playedOn']),
      teams.createHashIndex(['players']),
      players.createHashIndex(['trigram'])
    ]);
  }

  async _createVertexCollection(name) {
    try {
      await this.graph.addVertexCollection(name);
      logger.info(`Vertex collection '${name}' created.`)
      return this.graph.vertexCollection(name);
    } catch (e) {
      logger.info(`Vertex collection '${name}' exists. Skipping...`);
      return this.graph.vertexCollection(name);
    }
  }

  async _createEdgeCollection(name, from, to) {
    try {
      await this.graph.addEdgeDefinition({
        collection: name,
        from: [from],
        to: [to]
      });
      logger.info(`Edge collection '${name}' created.`)
      return this.graph.edgeCollection(name);
    } catch (e) {
      logger.info(`Edge collection '${name}' exists. Skipping...`);
      return this.graph.edgeCollection(name);
    }
  }

  get graph() {
    return this.server.graph(this.options.graphName);
  }
}
