import nock from 'nock'
import { Wykop } from './wykop'
import { Client } from './client'
import { testConfig, createTestClient } from './testUtils/testConfig'
describe('wykop client tests', () => {
	let wykop: Wykop
	let client: Client
	beforeEach(() => {
		wykop = createTestClient()
		client = new Client(wykop, {
			username: 'sokytsinolop',
			accountkey: 'blah',
			userkey: 'userkey', //to not call getUserKey in constructor
		})
	})
	it('client get userkey', async () => {
		nock('https://a2.wykop.pl')
			.post(/\/login\/index\/.*/)
			.reply(200, { data: { userkey: 'userkey123' } })
		expect(client.getUserKey()).resolves.toEqual('userkey123')
	})
	it('client request should add userkey to request namedParams', async () => {
		nock('https://a2.wykop.pl')
			.get(/\/entries\/stream\/.*/)
			.reply(200)
		client['_ctx'].request = jest.fn()
		await client.request('entries/stream')
		expect(client['_ctx'].request).toBeCalledWith(
			expect.any(String),
			expect.objectContaining({ namedParams: expect.objectContaining({ userkey: 'userkey' }) }),
			undefined,
		)
	})
})
