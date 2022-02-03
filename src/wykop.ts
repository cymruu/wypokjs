import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { createHash } from 'crypto'
import querystring from 'querystring'
import { IWykopResponse, IWykopError } from './models/WykopResponse'

export interface IWykopConfig {
	appkey: string
	secret: string
	host?: string
	timeout?: number
	userAgent?: string
}
export type namedParamsT = { [key: string]: string }
export interface IRequestParams {
	apiParam?: string,
	namedParams?: namedParamsT
	postParams?: any
}
export interface IRequestOptions {
	data?: 'full' | 'compacted'
	output?: 'clear' | 'both'
	//return?: string //TODO: learn how this option should look because API doesnt say a word about syntax of this field
}
const emptyRequestParmas: IRequestParams = {
	apiParam: '',
	namedParams: Object.create(null),
	postParams: undefined,
}
export const defaultClientConfig = {
	userAgent: 'wypokJS/0.1.7',
	host: 'a2.wykop.pl',
	timeout: 5000,
}

export type errorInterceptor = (error: WykopError | AxiosError) => typeof error

export class Wykop {
	private config: IWykopConfig
	private _http: AxiosInstance
	private _baseUrl: string
	constructor(config: IWykopConfig, private errorInterceptors: errorInterceptor[] = []) {
		this.config = { ...defaultClientConfig, ...config }
		this._baseUrl = new URL(`https://${this.config.host}`).toString()
		this._http = axios.create()
		this.configureHttpClient()
	}
	static namedParamsToString(namedParams: namedParamsT) {
		const { appkey, ...rest } = namedParams
		return Object.entries(rest).filter(([, key]) => key)
			.reduce((p, [key, value]) => `${p}${key}/${value}/`, `appkey/${appkey}/`)
	}
	private configureHttpClient() {
		this._http.defaults.timeout = this.config.timeout
		this._http.defaults.headers.common['User-Agent'] = this.config.userAgent
	}
	private buildUrl(endpoint: string, { apiParam, namedParams }: IRequestParams): URL {
		if (endpoint.charAt(0) === '/') { endpoint = endpoint.substr(1) }
		if (endpoint.charAt(endpoint.length - 1) === '/') { endpoint = endpoint.substring(0, endpoint.length - 1) }
		return new URL(
			`${endpoint}/${apiParam}${apiParam ? '/' : ''}${Wykop.namedParamsToString(namedParams)}`, this._baseUrl,
		)
	}
	private signRequest(url: string, { postParams }: IRequestParams) {
		let signData = `${this.config.secret}${url}`
		if (postParams) {
			//formBody | multipart
			signData += Object.keys(postParams)
				.map(key => postParams[key])
				.join(',')
		}
		return createHash('md5').update(signData).digest('hex')
	}
	private makeRequest(endpoint: string, params: IRequestParams = {}, requestOptions?: IRequestOptions) {
		params = { ...emptyRequestParmas, namedParams: { ...requestOptions }, ...params }
		params.namedParams['appkey'] = this.config.appkey
		const requestURL = this.buildUrl(endpoint, params).toString()
		const apisign = this.signRequest(requestURL, params)
		const headers = {
			apisign,
		}
		const isPOSTRequest = params.postParams ? true : false
		if (isPOSTRequest) {
			//if multipart
			headers['content-type'] = 'application/x-www-form-urlencoded'
		}
		const payload = isPOSTRequest ? querystring.stringify(params.postParams) : undefined

		return this._http.request({
			method: isPOSTRequest ? 'POST' : 'GET',
			url: requestURL,
			data: payload,
			headers,
		})
	}
	public async request<T>(endpoint: string, params: IRequestParams = {}, requestOptions?: IRequestOptions) {
		return new Promise<IWykopResponse<T>>((resolve, reject) => {
			return this.makeRequest(endpoint, params, requestOptions).then(
				(response: AxiosResponse<IWykopResponse<T>>) => {
					if (response.data.error) {
						return reject({ response })
					}
					resolve(response.data)
				},
			).catch(err => reject(err))
		}).catch((error: AxiosError<IWykopResponse<T>>) => {
			let errorObject: AxiosError | WykopError = error
			if (error.response.data.error) {
				errorObject = new WykopError(error.response.status, error.response.data.error)
			}
			throw this.errorInterceptors
				.reduce((errorObject, currentInterceptor) => currentInterceptor(errorObject), errorObject)
		})
	}
}
export class WykopError extends Error {
	constructor(public httpStatus: number, public errorObject: IWykopError) {
		super()
		this.name = 'WykopAPIError'
	}
	toString() {
		return `[${this.httpStatus}] ${this.name} [${this.errorObject.code}] ${this.errorObject.message_en}`
	}
}
