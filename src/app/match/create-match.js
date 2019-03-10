import EventEmitter from 'events';

class CreateMatchUseCase extends EventEmitter {
  constructor({ matchRepository }) {
    super();
    this.matchRepository = matchRepository;
    this.outputs = {
      SUCCESS: 'success',
      ERROR: 'error',
    };
  }

  async execute(match) {
    try {
      const resultMatch = await this.matchRepository.create(match);
      this.emit(this.outputs.SUCCESS, resultMatch);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default opts => new CreateMatchUseCase(opts);
