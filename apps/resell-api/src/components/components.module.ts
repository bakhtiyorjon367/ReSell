import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { NoticeModule } from './notice/notice.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MemberModule, 
    AuthModule, 
    ProductModule, 
    BoardArticleModule,
    LikeModule, 
    ViewModule, 
    CommentModule,
    FollowModule,
    NoticeModule,
    NotificationModule, 
  ]
})
export class ComponentsModule {}
