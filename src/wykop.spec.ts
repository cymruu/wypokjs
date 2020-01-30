import { Wykop, namedParamsT, defaultClientConfig } from './wykop'
import { testConfig, createTestClient } from './testUtils/testConfig'

describe('wykop class tests', () => {
	describe('namedParamsToString method', () => {
		it('should correct query path string', () => {
			const params: namedParamsT = {
				appkey: 'appkeyValue',
				secret: 'secretValue',
			}
			expect(Wykop.namedParamsToString(params)).toEqual('appkey/appkeyValue/secret/secretValue/')
		})
		it('should not add params without value', () => {
			const params: namedParamsT = {
				appkey: 'appkeyValue',
				secret: undefined,
			}
			expect(Wykop.namedParamsToString(params)).toEqual('appkey/appkeyValue/')
		})
	})
	describe('wykop client tests', () => {
		let client: Wykop
		beforeEach(() => {
			client = createTestClient(testConfig)
		})
		it('config should have set fields and defaults one', () => {
			expect((client as any).config).toEqual({ ...defaultClientConfig, ...testConfig })
		})
		it('request', () => {
			client.makeRequest('/', { apiParam: '1', namedParams: {}, postParams: {} })
		})
	})
})