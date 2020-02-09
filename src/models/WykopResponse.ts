export interface IWykopResponse<T> {
    data: T,
    pagination?: {
        next: string,
        prev: string,
    }
    error: IWykopError
}

export interface IWykopError {
	code: number
	field: string
	message_en: string
	message_pl: string
}
