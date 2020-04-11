import { Client } from './client'
import { Wykop } from './wykop'


class WykopApiService {
	constructor(protected ctx: Wykop | Client) { }
}

class EntriesService extends WykopApiService {
	private endpoint = 'entries'
	Entry(entryId: string | number) {
		return this.ctx.request(`${this.endpoint}/entry`, { apiParam: entryId.toString() })
	}
	CommentUpvoters(entryCommentId: string | number) {
		return this.ctx.request(`${this.endpoint}/commentupvoters`, { apiParam: entryCommentId.toString() })
	}
	Delete(entryId: string | number) {
		return this.ctx.request(`${this.endpoint}/delete`, { apiParam: entryId.toString() })
	}
}

export function CreateWykopService(ctx: Wykop | Client) {
	return {
		Entries: new EntriesService(ctx),
	}
}
