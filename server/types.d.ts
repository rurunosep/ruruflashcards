export interface IUser {
	username: string
	deck_ids: ObjectId[]
}

declare global {
	namespace Express {
		interface User extends IUser {}
	}
}
