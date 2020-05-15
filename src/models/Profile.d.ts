import { WykopColor } from './WykopColor'

export interface Profile {
    login: string;
    color: WykopColor;
    sex?: string;
    avatar: string;
    signup_at?: Date;
    background?: string;
    about?: string;
    links_added_count?: number;
    links_published_count?: number;
    comments_count?: number;
    rank?: number;
    followers?: number;
}
