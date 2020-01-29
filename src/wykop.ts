import axios, { AxiosInstance } from 'axios'

export interface WykopAPIClientConfig {
	appkey: string
	secret: string
	host?: string
	timeout?: number
	userAgent?: string
}
export type namedParamsT = { [key: string]: string }
interface WykopRequestParams {
	apiParam: string,
	namedParams: namedParamsT
	postParams: any
}
const defaultClientConfig = {
	userAgent: 'wypokJS/0.0.1',
	host: 'a2.wykop.pl',
	timeout: 5000,
}

export class Wykop {
	private config: WykopAPIClientConfig
	private _http: AxiosInstance
	constructor(config: WykopAPIClientConfig) {
		this.config = { ...defaultClientConfig, ...config }
		this._http = axios.create()
		this.configureHttpClient()
	}
	static namedParamsToString(namedParams: namedParamsT) {
		return `${Object.entries(namedParams).filter(([_, value]) => value).map(x => x.join('/')).join('/')}/`
	}
	private configureHttpClient() {
		this._http.defaults.timeout = this.config.timeout
		this._http.defaults.baseURL = new URL(`https://${this.config.host}`).toString()
		this._http.defaults.headers.common['User-Agent'] = this.config.userAgent
	}
	private makeQueryPath(endpoint: string, { apiParam, namedParams }: WykopRequestParams) {
		return `${endpoint}/${apiParam}/${Wykop.namedParamsToString(namedParams)}`
	}
	public makeRequest(endpoint: string, params: WykopRequestParams) {
		axios.get(this.makeQueryPath(endpoint, params))
	}
}