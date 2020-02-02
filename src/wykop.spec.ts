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
			;(client as any)._http.defaults.adapter = httpAdapter
		})
		it('config should have set fields and default values for not set options', () => {
			expect((client as any).config).toEqual({ ...defaultClientConfig, ...testConfig })
		})
		describe('makeRequest', () => {
			it('request should have user agent header', async () => {
				nock('https://a2.wykop.pl')
					.get(/\/entries\/stream\/.*/)
					.reply(200)
				const response = await client.makeRequest('entries/stream')
				expect(response.request.headers).toMatchObject({ 'user-agent': defaultClientConfig.userAgent })
			})
			it('get request should not have Content-Type header', async () => {
				nock('https://a2.wykop.pl')
					.get(/\/entries\/stream\/.*/)
					.reply(200)
				const response = await client.makeRequest('entries/stream')
				expect(response.request.headers).not.toHaveProperty('content-type')
			})
			it('POST request should have Content-Type header', async () => {
				nock('https://a2.wykop.pl')
					.post(/\/entries\/add\/.*/)
					.reply(200)
				const response = await client.makeRequest('entries/add', { postParams: { body: 'content' } })
				expect(response.request.headers).toMatchObject({ 'content-type': 'application/x-www-form-urlencoded' })
			})
		})
		describe('apisign tests', () => {
			it('apisign for request with default namedParams only', async () => {
				nock('https://a2.wykop.pl')
					.get(/\/entries\/stream\/.*/)
					.reply(200)
				const response = await client.makeRequest('entries/stream')
				expect(response.request.headers).toMatchObject({ 'apisign': '29e8293fc1a92e563468673b7f6b5292' })
			})
			it('apisign for request with namedParams', async () => {
				nock('https://a2.wykop.pl')
					.get(/\/entries\/hot\/.*/)
					.reply(200)
				const response = await client.makeRequest('entries/hot', { namedParams: { page: '1', period: '12' } })
				expect(response.request.headers).toMatchObject({ 'apisign': 'b2737520793976dc044e0cf26309e68a' })
			})
		})
	})
})
