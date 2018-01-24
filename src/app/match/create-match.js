import EventEmitter from 'events';

class AddMatchUseCase extends EventEmitter {
  constructor({ matchRepository, teamRepository, playerRepository }) {
    super();
    this.matchRepository = matchRepository;
    this.teamRepository = teamRepository;
    this.playerRepository = playerRepository;
    this.outputs = {
      SUCCESS: 'success',
      ERROR: 'error',
    };
  }

  async execute(match) {
    try {
      // Create players
      const redPlayerPromises = match.red.players.map(async p => this.playerRepository.create(p));
      const bluePlayerPromises = match.blue.players.map(async p => this.playerRepository.create(p));
      const [redPlayerIds, bluePlayerIds] = await Promise.all([
        Promise.all(redPlayerPromises),
        Promise.all(bluePlayerPromises),
      ]);
      // Create teams
      const [redTeamId, blueTeamId] = await Promise.all([
        this.teamRepository.create(redPlayerIds),
        this.teamRepository.create(bluePlayerIds),
      ]);
      // Create match
      const matchId = await this.matchRepository.create({
        match,
        redTeamId,
        blueTeamId,
      });
      this.emit(this.outputs.SUCCESS, matchId);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default repositories => new AddMatchUseCase(repositories);
