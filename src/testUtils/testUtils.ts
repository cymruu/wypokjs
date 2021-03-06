import { IWykopConfig, Wykop, IRequestOptions } from 'src/wykop'
import httpAdapter from 'axios/lib/adapters/http'

export const testConfig: IWykopConfig = {
	appkey: 'testappkey',
	secret: 'testsecret',
}

export function createTestWrapper(config: IWykopConfig = testConfig) {
	const client = new Wykop(config)
	client['_http'].defaults.adapter = httpAdapter
	return client
}

export const testRequestOptions: IRequestOptions = { data: 'full', output: 'clear' }
