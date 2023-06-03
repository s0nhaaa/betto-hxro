export type Player = {
  id: string
  walletAddress: string
  position: {
    x: number
    y: number
    z: number
  }
  quaternion: {
    x: number
    y: number
    z: number
    w: number
  }
}

export type Players = {
  id: Player
}
