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
	constructor(ctx: Wykop, config: IClientConfig) {
		this._ctx = ctx
		this._config = config
		if (!this._config.userkey) {
			this.getUserKey()
		}
	}
	private async request<T>(endpoint: string, params: IRequestParams = {}, requestOptions?: IRequestOptions) {
		if (!params.namedParams) {
			params.namedParams = { }
		}
		if (!params.namedParams.userkey) {
			if (!this._config.userkey) {console.warn('Trying to authorize request with empty userkey')}
			params.namedParams.userkey = this._config.userkey
		}
		try {
			const response = await this._ctx.request<T>(endpoint, params, requestOptions)
			console.log(response)
		} catch (error) {
			console.log(error)
		}
	}
	public async getUserKey() {
		this._ctx.request<LoginResponse>(
			'login/index',
			{ postParams: { login: this._config.username, accountkey: this._config.accountkey } },
		).then(response => {
			this._config.userkey = response.userkey
		})
	}
}
