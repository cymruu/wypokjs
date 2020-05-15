import { Profile } from './Profile'
export type EntryAuthor = Pick<Profile, 'login' | 'color' | 'sex' | 'avatar'>
export interface Entry {
    id: number
    date: Date
    body: string
    author: EntryAuthor
    blocked: boolean
    favorite: boolean
    vote_count: number
    comments_count: number
    comments: EntryComment[]
    status: string
    can_comment: boolean
    user_vote: number
    archived: boolean
}

export interface EntryComment {
    id: number
    author: EntryAuthor
    date: Date
    body: string
    blocked: boolean
    favorite: boolean
    vote_count: number
    status: string
    user_vote: number
    archived: boolean
    violation_url?: string
}
