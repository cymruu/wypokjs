import { Profile } from './Profile'

export type CommentUpvoter = {author: Pick<Profile, 'login' | 'color' | 'avatar'>, date: Date, vote_type: number}
