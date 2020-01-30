import { WykopAPIClientConfig, Wykop } from 'src/wykop'

export const testConfig: WykopAPIClientConfig = {
	appkey: 'testappkey',
	secret: 'testsecret',
}

export function createTestClient(config: WykopAPIClientConfig) {
	const client = new Wykop(config)
	client._http.interceptors.request.use((config) => {
		return false
	})
	return client
}