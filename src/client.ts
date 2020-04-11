import { Wykop, IRequestParams, IRequestOptions, WykopError } from './wykop'
import { LoginResponse } from './models/LoginResponse'

interface IClientConfig {
	username: string
	accountkey: string
	userkey?: string
	password?: string //only allowed on apikeys for iOS, android app, OWM app
}
export class Client {
	private _userkey: string
	constructor(private _ctx: Wykop, private _config: IClientConfig) {
		this._userkey = this._config.userkey
		if (!this._userkey) {
			this.getUserKey()
		}
	}
	public async request<T>(endpoint: string, params: IRequestParams = {}, requestOptions?: IRequestOptions) {
		const contextNamedParams = { userkey: this._userkey }
		params.namedParams = params.namedParams ? { ...params.namedParams, ...contextNamedParams } : contextNamedParams

		return this._ctx.request<T>(endpoint, params, requestOptions)
	}
	public async getUserKey() {
		this._ctx.request<LoginResponse>(
			'login/index',
			{
				postParams:
				{
					login: this._config.username,
					accountkey: this._config.accountkey,
					password: this._config.password,
				},
			},
		).then(response => {
			this._userkey = response.userkey
		})
		//TODO: handle error
	}
}
