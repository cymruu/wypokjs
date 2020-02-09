import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { createHash } from 'crypto'
import { promises, resolve } from 'dns'
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
interface IRequestParams {
	apiParam?: string,
	namedParams?: namedParamsT
	postParams?: any
}
interface IRequestOptions {
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
	userAgent: 'wypokJS/0.0.1',
	host: 'a2.wykop.pl',
	timeout: 5000,
}

export class Wykop {
	private config: IWykopConfig
	private _http: AxiosInstance
	private _baseUrl: string
	constructor(config: IWykopConfig) {
		this.config = { ...defaultClientConfig, ...config }
		this._baseUrl = new URL(`https://${this.config.host}`).toString()
		this._http = axios.create()
		this.configureHttpClient()
	}
	static namedParamsToString(namedParams: namedParamsT) {
		return Object.entries(namedParams).filter(([, key]) => key)
			.reduce((p, [key, value]) => `${p}${key}/${value}/`, '')
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
				.filter(key => postParams[key])
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
		return this._http.request({
			method: isPOSTRequest ? 'POST' : 'GET',
			url: requestURL,
			data: isPOSTRequest ? querystring.stringify(params.postParams) : undefined,
			headers,
		})
	}
	public async request<T>(endpoint: string, params: IRequestParams = {}, requestOptions?: IRequestOptions) {
		return new Promise((resolve, reject) => {
			this.makeRequest(endpoint, params, requestOptions).then(
				(response: AxiosResponse<IWykopResponse<T>>) => {
					if (response.data.error) {
						throw new WykopError(response.data.error, response.request)
					}
					resolve(response.data.data)
				},
			).catch(error => reject(error))
		})
	}
}
class WykopError extends Error {
	constructor(private errorObject: IWykopError, public request: any) {
		super()
		this.name = 'WykopAPIError'
	}
	toString() {
		return `${this.name} [${this.errorObject.code}] ${this.errorObject.message_en}`
	}
}
