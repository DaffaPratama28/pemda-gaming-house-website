import { MEMBERS, RIDHO_PROFILE } from '../data/content'
import type { CardHud } from './textures'

const ridho = MEMBERS.find((member) => member.id === 'ridho')

/** Data HUD kartu Ridho (dipakai scene hero & spotlight). */
export const RIDHO_HUD: CardHud = {
  name: ridho?.name ?? 'Ridho',
  number: ridho?.number ?? '02',
  role: RIDHO_PROFILE.role,
  rank: RIDHO_PROFILE.rank,
  level: RIDHO_PROFILE.level,
}
