export interface IWykopResponse<T> {
    data: T,
    pagination?: {
        next: string,
        prev: string,
    }
    error: {
        code: number,
        field: any //TODO: learn what it is
        message_pl: string
        message_en: string
    }
}
