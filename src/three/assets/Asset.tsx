import { Coin } from './Coin'
import { Crate } from './Crate'
import { Crewmate } from './Crewmate'
import { Crystal } from './Crystal'
import { Dice } from './Dice'
import { Football } from './Football'
import { Gamepad } from './Gamepad'
import { GrassBlock } from './GrassBlock'
import { Headset } from './Headset'
import { Keycap, type KeycapTone } from './Keycap'
import { Pawn } from './Pawn'

export type AssetKind =
  | 'gamepad'
  | 'headset'
  | 'keycap'
  | 'keycaps'
  | 'coin'
  | 'crystal'
  | 'dice'
  | 'ball'
  | 'grass'
  | 'crate'
  | 'crewmate'
  | 'pawn'

type Props = {
  kind: AssetKind
  /** Huruf untuk keycap tunggal. */
  label?: string
  tone?: KeycapTone
}

/** Klaster W-A-S-D: kontrol wajib gamer PC. */
function WasdCluster() {
  return (
    <group scale={0.62}>
      <group position={[0, 0.62, 0]}>
        <Keycap label="W" tone="acid" />
      </group>
      {(['A', 'S', 'D'] as const).map((letter, index) => (
        <group key={letter} position={[(index - 1) * 1.12, -0.5, 0]}>
          <Keycap label={letter} />
        </group>
      ))}
    </group>
  )
}

/** Satu pintu untuk semua aset prosedural (hero, spotlight, preview arsenal). */
export function Asset({ kind, label, tone }: Props) {
  switch (kind) {
    case 'gamepad':
      return <Gamepad />
    case 'headset':
      return <Headset />
    case 'keycap':
      return <Keycap label={label ?? 'P'} tone={tone} />
    case 'keycaps':
      return <WasdCluster />
    case 'coin':
      return <Coin />
    case 'crystal':
      return <Crystal />
    case 'dice':
      return <Dice />
    case 'ball':
      return <Football />
    case 'grass':
      return <GrassBlock />
    case 'crate':
      return <Crate />
    case 'crewmate':
      return <Crewmate />
    case 'pawn':
      return <Pawn />
  }
}
