import { Wykop } from './wykop'

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
		if (this._config.userkey) {
			//getUserKey
		}
	}
	public async getUserKey() {
		const response = await this._ctx.makeRequest(
			'login/index',
			{ postParams: { login: this._config.username, accountkey: this._config.accountkey } },
		)
		console.log(response)
	}
}