import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { createHash } from 'crypto'
import { promises, resolve } from 'dns'

export interface WykopAPIClientConfig {
	appkey: string
	secret: string
	host?: string
	timeout?: number
	userAgent?: string
}
export type namedParamsT = { [key: string]: string }
interface WykopRequestParams {
	apiParam?: string,
	namedParams?: namedParamsT
	postParams?: any
}
const emptyRequestParmas: WykopRequestParams = {
	apiParam: '',
	namedParams: Object.create(null),
	postParams: Object.create(null),
}
export const defaultClientConfig = {
	userAgent: 'wypokJS/0.0.1',
	host: 'a2.wykop.pl',
	timeout: 5000,
}

export class Wykop {
	private config: WykopAPIClientConfig
	private _http: AxiosInstance
	private _baseUrl:string
	constructor(config: WykopAPIClientConfig) {
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
	private buildUrl(endpoint: string, { apiParam, namedParams }: WykopRequestParams): URL {
		if (endpoint.charAt(0) === '/') {endpoint = endpoint.substr(1)}
		if (endpoint.charAt(endpoint.length - 1) === '/') { endpoint = endpoint.substring(0, endpoint.length - 1)}
		return new URL(
			`${endpoint}/${apiParam}${apiParam ? '/' : ''}${Wykop.namedParamsToString(namedParams)}`, this._baseUrl,
		)
	}
	private signRequest(url: URL, { postParams }: WykopRequestParams) {
		const signData = `${this.config.secret}${url}`
		if (postParams) {
			//formBody | multipart
		}
		return createHash('md5').update(signData).digest('hex')
	}
	public makeRequest(endpoint: string, params: WykopRequestParams = {}) {
		params = { ...emptyRequestParmas, ...params }
		return this._http.request({
			method: params.postParams ? 'POST' : 'GET',
			url: this.buildUrl(endpoint, params).toString(),
			data: params.postParams || undefined,
		})
	}
}