// post-reaction.controller.ts
import { Controller, Post, Get, Param, Body, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('posts/:postId/reactions')
export class ReactionController {
    constructor(
        private readonly reactionService: ReactionService,
    ) {}

    @Post()
    async addReaction(
        @Req() req,
    ) {
        const { postId } = req.params;  
        if(!postId) {
            throw new ForbiddenException('Thiếu id của post');
        }        
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        
        return this.reactionService.addReaction(postId, req.user.sub);
    }

    @Delete(':userId')
    async removeReaction(
        @Param('postId') postId: string,
        @Param('userId') userId: string,
    ) {
        return this.reactionService.removeReaction(postId, userId);
    }

    @Get()
    async getReactions(@Param('postId') postId: string) {
        return this.reactionService.getReactions(postId);
    }

    @Get('count')
    async countReactions(@Param('postId') postId: string) {
        return this.reactionService.countReactions(postId);
    }
    @Post("add-likes")
    async addLike(
        @Req() req,
    ) {
        const { postId } = req.params;  
        if(!postId) {
            throw new ForbiddenException('Thiếu id của post');
        }        
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        
        return this.reactionService.addLike(postId, req.user.sub);
    }
}
