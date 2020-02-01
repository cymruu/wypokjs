import { IWykopConfig, Wykop } from 'src/wykop'

export const testConfig: IWykopConfig = {
	appkey: 'testappkey',
	secret: 'testsecret',
}

export function createTestClient(config: IWykopConfig) {
	return new Wykop(config)
}