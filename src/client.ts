import { Wykop } from './wykop'
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
	public async getUserKey() {
		this._ctx.request<LoginResponse>(
			'login/index',
			{ postParams: { login: this._config.username, accountkey: this._config.accountkey } },
		).then(response => {
			this._config.userkey = response.userkey
		})
	}
}
