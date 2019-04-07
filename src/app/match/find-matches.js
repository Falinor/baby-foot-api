import EventEmitter from 'events';

class FindMatchesUseCase extends EventEmitter {
  constructor({ matchRepository }) {
    super();
    this.matchRepository = matchRepository;
    this.outputs = {
      SUCCESS: 'success',
      ERROR: 'error',
    };
  }

  async execute() {
    try {
      // Find matches
      const matches = await this.matchRepository.find();
      this.emit(this.outputs.SUCCESS, matches);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default opts => new FindMatchesUseCase(opts);
