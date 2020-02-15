import { IWykopConfig, Wykop } from 'src/wykop'
import httpAdapter from 'axios/lib/adapters/http'

export const testConfig: IWykopConfig = {
	appkey: 'testappkey',
	secret: 'testsecret',
}

export function createTestClient(config: IWykopConfig = testConfig) {
	const client = new Wykop(config)
	client['_http'].defaults.adapter = httpAdapter
	return client
}
