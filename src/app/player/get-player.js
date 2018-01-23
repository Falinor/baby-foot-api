/**
 * @module GetPlayer use-case interactor
 */

import { EventEmitter } from 'events';

class GetPlayerUseCase extends EventEmitter {
  constructor(playerRepository) {
    super();
    this.playerRepository = playerRepository;
    this.outputs = {
      SUCCESS: 'success',
      ERROR: 'error',
    };
  }

  /**
   * @todo
   */
  async execute(id) {
    try {
      const player = await this.playerRepository.findById(id);
      this.emit(this.outputs.SUCCESS, player);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default playerRepo => new GetPlayerUseCase(playerRepo);
