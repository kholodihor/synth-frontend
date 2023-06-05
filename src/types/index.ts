export type User = {
  _id: string
  token: string
  username: string
  email: string
  image: string
  avatarUrl?: string
}

export type Song = {
  _id: string
  user: string
  artist: string
  title: string
  song: string
}

export type NewSong = {
  name: string
  artist: string
  url: string
}

export type Band = {
  _id: string
  title: string
  location: string
  description: string
  image: string
  user?: User
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
