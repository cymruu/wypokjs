import { Wykop, namedParamsT, defaultClientConfig } from './wykop'
import { testConfig, createTestClient } from './testUtils/testConfig'
import nock from 'nock'
import httpAdapter from 'axios/lib/adapters/http'
import Axios from 'axios'

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
			; (client as any)._http.defaults.adapter = httpAdapter
		})
		it('config should have set fields and default values for not set options', () => {
			expect((client as any).config).toEqual({ ...defaultClientConfig, ...testConfig })
		})
		describe('makeRequest', () => {
			it('1', async () => {
				const scope = nock('https://a2.wykop.pl')
					.get('/entries/stream')
					.reply(200, 'test response')
				const response = await client.makeRequest('entries/stream')
				expect(response.data).toBe('test response')
			})
		})
	})
})