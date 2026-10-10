export type User = {
  _id: string
  token: string
  username: string
  email: string
  image: string
}

export type AuthResponse = {
  _id: string
  username: string
  email: string
  token: string
  avatarUrl?: string
}

export type Song = {
  _id: string
  user: string
  artist: string
  title: string
  song: string
  url: string
}

export type Band = {
  _id: string
  title: string
  location: string
  description: string
  image: string
  user?: { _id: string; username: string; avatarUrl?: string }
}

export type Video = {
  _id: string
  user: string
  title: string
  url: string
}

export type Girl = {
  id: number
  name: string
  image: string
  url: string
}
