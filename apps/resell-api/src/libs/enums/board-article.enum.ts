import { registerEnumType } from '@nestjs/graphql';

export enum BoardArticleCategory {
	QUESTION = 'QUESTION',
	FREE = 'FREE',
	RECOMMEND = 'RECOMMEND',
	HOBBY = 'HOBBY',
}
registerEnumType(BoardArticleCategory, {
	name: 'BoardArticleCategory',
});

export enum BoardArticleStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(BoardArticleStatus, {
	name: 'BoardArticleStatus',
});
