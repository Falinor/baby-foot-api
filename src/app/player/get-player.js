/**
 * @module Player use-case interactor
 */

import { EventEmitter } from 'events';

class GetPlayer extends EventEmitter {
  constructor(playerRepository) {
    super();
    this.playerRepository = playerRepository;
  }

  /**
   * @todo
   */
  async execute(id) {
    try {
      const player = await this.playerRepository.findById(id);
      this.emit('success', player);
    } catch (err) {
      this.emit('error', err);
    }
  }
}

export default playerRepo => new GetPlayer(playerRepo);
