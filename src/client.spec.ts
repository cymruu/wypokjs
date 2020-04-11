import nock from 'nock'
import { Wykop, IRequestOptions } from './wykop'
import { Client } from './client'
import { createTestWrapper, testRequestOptions, testConfig } from './testUtils/testUtils'
describe('wykop client tests', () => {
	let wykop: Wykop
	const noop = () => { }
	beforeEach(() => {
		wykop = createTestWrapper(testConfig)
		wykop.request = jest.fn().mockImplementation(() => new Promise(noop))
	})
	it('client get userkey', async () => {
		nock('https://a2.wykop.pl')
			.post(/\/login\/index\/.*/)
			.reply(200, { data: { userkey: 'userkey123' } })
			.persist()
		const realWykop = createTestWrapper(testConfig)
		const client = new Client(realWykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		await client.getUserKey()
		expect(client['_userkey']).toEqual('userkey123')
	})
	it('should not call getUserKey on init if userkey was provided', () => {
		const _ = new Client(wykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		expect(wykop.request).toHaveBeenCalledTimes(0)
	})
	it('making request from client should call request on context with client userkey', () => {
		const client = new Client(wykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		client.request('a')
		expect(wykop.request).toBeCalledWith(expect.anything(), { namedParams: { userkey: 'any' } }, {})
	})
	it('client with requestoptions should be included in request', async () => {
		nock('https://a2.wykop.pl')
			.get(/\/entries\/stream\/.*/)
			.reply(200)
		const client = new Client(wykop, { username: 'test', accountkey: 'accountkey', userkey: 'any' })
		client.requestOptions = testRequestOptions
		client.request('entries/stream')
		expect(wykop.request).toBeCalledWith(
			expect.any(String),
			expect.anything(),
			testRequestOptions,
		)
	})
})
