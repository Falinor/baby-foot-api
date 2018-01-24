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
      const [redPlayers, bluePlayers] = await Promise.all([
        this.playerRepository.insertMany(match.red.players),
        this.playerRepository.insertMany(match.blue.players),
      ]);
      // Create teams
      const [redTeamId, blueTeamId] = await this.teamRepository.insertMany([
        { redPlayers },
        { bluePlayers },
      ]);
      // Create match
      const matchId = await this.matchRepository.insertOne({
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
