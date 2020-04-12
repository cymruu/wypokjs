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
	Add({ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean }) {
		return this.ctx.request(`${this.endpoint}/add`, { postParams: { body, embed, adultmedia } })
	}
	Delete(entryId: string | number) {
		return this.ctx.request(`${this.endpoint}/delete`, { apiParam: entryId.toString() })
	}
	CommentAdd(
		entryId: string | number,
		{ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean }
	) {
		return this.ctx.request(
			`${this.endpoint}/commentadd`, { apiParam: entryId.toString(), postParams: { body, embed, adultmedia } }
		)
	}
	CommentUpvoters(entryCommentId: string | number) {
		return this.ctx.request(`${this.endpoint}/commentupvoters`, { apiParam: entryCommentId.toString() })
	}
	CommentDelete(entryCommentId: string | number) {
		return this.ctx.request(`${this.endpoint}/commentdelete`, { apiParam: entryCommentId.toString() })
	}
}

class Pm extends WykopApiService {
	private endpoint = 'pm'
	//TODO: embed param
	SendMessage(receiver: string, body: string) {
		return this.ctx.request(`${this.endpoint}/commentdelete`, { apiParam: receiver, postParams: { body } })
	}
}


export function CreateWykopService(ctx: Wykop | Client) {
	return {
		Entries: new EntriesService(ctx),
		Pm: new Pm(ctx),
	}
}
