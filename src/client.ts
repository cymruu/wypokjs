import { Wykop, IRequestParams, IRequestOptions } from './wykop'
import { LoginResponse } from './models/LoginResponse'

interface IClientConfig {
	username: string
	accountkey: string
	userkey?: string
}
export class Client {
	private _ctx: Wykop
	private _config: IClientConfig
	private _requestOptions?: IRequestOptions
	constructor(ctx: Wykop, config: IClientConfig) {
		this._ctx = ctx
		this._config = config
		if (!this._config.userkey) {
			this.getUserKey()
		}
	}
	public async request<T>(
		endpoint: string,
		params: IRequestParams = {},
		requestOptions: IRequestOptions = this._requestOptions,
	) {
		if (!params.namedParams) {
			params.namedParams = { }
		}
		if (!params.namedParams.userkey) {
			if (!this._config.userkey) {console.warn('Trying to authorize request with empty userkey')}
			params.namedParams.userkey = this._config.userkey
		}

		return this._ctx.request<T>(endpoint, params, requestOptions)
	}
	public getUserKey() {
		return this._ctx.request<LoginResponse>(
			'login/index',
			{ postParams: { login: this._config.username, accountkey: this._config.accountkey } },
		).then(response => {
			this._config.userkey = response.userkey
			return this._config.userkey
		}).catch((error) => {
			console.log(error)
		})
	}

	set requestOptions(requestOptions: IRequestOptions) {
		this._requestOptions = requestOptions
	}
}
