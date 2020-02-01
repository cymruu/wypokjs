import { WykopAPIClientConfig, Wykop } from 'src/wykop'

export const testConfig: WykopAPIClientConfig = {
	appkey: 'testappkey',
	secret: 'testsecret',
}

export function createTestClient(config: WykopAPIClientConfig) {
	return new Wykop(config)
}