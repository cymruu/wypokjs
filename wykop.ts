import axios, { AxiosInstance } from 'axios'

interface WykopAPIClientConfig {
	apikey: string
	secret: string
	host?: string
	timeout?: number
	userAgent?: string
}
interface WykopRequestParams {
	apiParam: string,
	namedParams: { [key: string]: string }
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
	private configureHttpClient() {
		this._http.defaults.timeout = this.config.timeout
		this._http.defaults.baseURL = new URL(`https://${this.config.host}`).toString()
		this._http.defaults.headers.common['User-Agent'] = this.config.userAgent
	}
	private makeQueryPath(endpoint: string, {apiParam, namedParams}: WykopRequestParams) {
		//todo make Object.entries work with typescript
		return `${endpoint}/${apiParam}/`
	}
	public makeRequest(endpoint: string, params: WykopRequestParams) {
		axios.get(endpoint)
	}
}