import { Team } from './team'

interface TeamAndScore extends Team {
  color: string;
  points: number
}

export interface Match {
  id: string
  red: TeamAndScore
  blue: TeamAndScore
  playedAt: Date
  createdAt?: Date
  updatedAt?: Date
}
