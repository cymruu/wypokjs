import { Client } from './client'
import { Wykop, IRequestParams } from './wykop'
import { CommentUpvoter } from './models/Upvoter'
import { Entry, EntryComment } from './models/Entry'

class WykopApiService {
	protected endpoint: string
	constructor(protected ctx: Wykop | Client) { }

	request<T>(method: string, params: IRequestParams) {
		return this.ctx.request<T>(`${this.endpoint}/${method}`, params)
			.then(response => response.data)
	}
}

class EntriesService extends WykopApiService {
	protected endpoint = 'entries'
	Entry(entryId: string | number) {
		return this.request<Entry>('entry', { apiParam: entryId.toString() })
	}
	Add({ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean }) {
		return this.request<Entry>('add', { postParams: { body, embed, adultmedia } })
	}
	Delete(entryId: string | number) {
		return this.request<Entry>('delete', { apiParam: entryId.toString() })
	}
	Comment(commentId: string | number) {
		return this.request<EntryComment>('comment', { apiParam: commentId.toString() })
	}
	CommentAdd(entryId: string | number,
		{ body, embed = undefined, adultmedia = false }: { body: string; embed?: string; adultmedia?: boolean },
	) {
		return this.request<EntryComment>(
			'commentadd', { apiParam: entryId.toString(), postParams: { body, embed, adultmedia } },
		)
	}
	CommentUpvoters(entryCommentId: string | number) {
		return this.request<CommentUpvoter[]>(
			'commentupvoters',
			{ apiParam: entryCommentId.toString() },
		)
	}
	CommentDelete(entryCommentId: string | number) {
		return this.request<EntryComment>('commentdelete', { apiParam: entryCommentId.toString() })
	}
}

class PmService extends WykopApiService {
	protected endpoint = 'pm'
	//TODO: embed param
	SendMessage(receiver: string, body: string) {
		return this.request<any>('sendmessage', { apiParam: receiver, postParams: { body } })
	}
}

export function CreateWykopService(ctx: Wykop | Client) {
	return {
		Entries: new EntriesService(ctx),
		Pm: new PmService(ctx),
	}
}
