import nock from 'nock'
import { Wykop } from './wykop'
import { Client } from './client'
import { testConfig, createTestClient } from './testUtils/testConfig'
describe('wykop client tests', () => {
	it('client get userkey', async () => {
		const wykop = createTestClient()
		nock('https://a2.wykop.pl')
			.post(/\/login\/index\/.*/)
			.reply(200, { data: { userkey: 'userkey123' } })
		const client = new Client(wykop, {
			username: 'sokytsinolop',
			accountkey: 'blah',
			userkey: 'userkey', //to not call getUserKey in constructor
		})
		expect(client.getUserKey()).resolves.toEqual('userkey123')
	})
})
