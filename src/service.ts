import { Client } from './client'
import { Wykop } from './wykop'
import { CommentUpvoter } from './models/Upvoter'
import { Entry, EntryComment } from './models/Entry'

class WykopApiService {
	constructor(protected ctx: Wykop | Client) { }
}

class EntriesService extends WykopApiService {
	private endpoint = 'entries'
	Entry(entryId: string | number) {
		return this.ctx.request<Entry>(`${this.endpoint}/entry`, { apiParam: entryId.toString() })
	}
	Add({ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean }) {
		return this.ctx.request<Entry>(`${this.endpoint}/add`, { postParams: { body, embed, adultmedia } })
	}
	Delete(entryId: string | number) {
		return this.ctx.request<Entry>(`${this.endpoint}/delete`, { apiParam: entryId.toString() })
	}
	Comment(commentId: string | number) {
		return this.ctx.request<EntryComment>(`${this.endpoint}/comment`, { apiParam: commentId.toString() })
	}
	CommentAdd(
		entryId: string | number,
		{ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean },
	) {
		return this.ctx.request<EntryComment>(
			`${this.endpoint}/commentadd`, { apiParam: entryId.toString(), postParams: { body, embed, adultmedia } },
		)
	}
	CommentUpvoters(entryCommentId: string | number) {
		return this.ctx.request<CommentUpvoter[]>(
			`${this.endpoint}/commentupvoters`,
			{ apiParam: entryCommentId.toString() },
		)
	}
	CommentDelete(entryCommentId: string | number) {
		return this.ctx.request<EntryComment>(`${this.endpoint}/commentdelete`, { apiParam: entryCommentId.toString() })
	}
}

class Pm extends WykopApiService {
	private endpoint = 'pm'
	//TODO: embed param
	SendMessage(receiver: string, body: string) {
		return this.ctx.request<any>(`${this.endpoint}/sendmessage`, { apiParam: receiver, postParams: { body } })
	}
}


export function CreateWykopService(ctx: Wykop | Client) {
	return {
		Entries: new EntriesService(ctx),
		Pm: new Pm(ctx),
	}
}
