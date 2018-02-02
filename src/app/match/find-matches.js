import EventEmitter from 'events';

class FindMatchesUseCase extends EventEmitter {
  constructor(matchRepository) {
    super();
    this.matchRepository = matchRepository;
    this.outputs = {
      SUCCESS: 'success',
      ERROR: 'error',
    };
  }

  async execute(search, opts) {
    try {
      // Find matches
      const matches = await this.matchRepository.find(search, opts);
      this.emit(this.outputs.SUCCESS, matches);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default matchRepository => new FindMatchesUseCase(matchRepository);
