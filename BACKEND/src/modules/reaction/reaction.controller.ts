import { Controller, Post, Get, Param, Body, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('blogs/:blogId/reactions')
export class ReactionController {
    constructor(
        private readonly reactionService: ReactionService,
    ) {}

    @Post()
    async addReaction(
        @Req() req,
    ) {
        const { blogId } = req.params;  
        if(!blogId) {
            throw new ForbiddenException('Thiếu id của blog');
        }        
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        
        return this.reactionService.addReaction(blogId, req.user.sub);
    }

    @Delete()
    async removeReaction(
        @Req() req,
    ) {
        const { blogId } = req.params;  
        if(!blogId) {
            throw new ForbiddenException('Thiếu id của blog');
        }        
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        return this.reactionService.removeReaction(blogId, req.user.sub);
    }

    @Get()
    async getReactions(@Param('blogId') blogId: string) {
        return this.reactionService.getReactions(blogId);
    }
    @Get('has-reaction')
    async hadReaction(
        @Req() req,
    ) {
        const { blogId } = req.params;
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        return this.reactionService.hasReacted(blogId, req.user.sub);
    }

    @Get('count')
    async countReactions(@Param('blogId') blogId: string) {
        return this.reactionService.countReactions(blogId);
    }
    
    @Post("add-likes")
    async addLike(
        @Req() req,
    ) {
        const { blogId } = req.params;  
        if(!blogId) {
            throw new ForbiddenException('Thiếu id của blog');
        }        
        if(!req?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }
        
        return this.reactionService.addLike(blogId, req.user.sub);
    }

    @Get('/popular')
    async getPopular() {
        return this.reactionService.getPopular();
    }

    @Get('/hot/:period')
    async getHot(@Param('period') period: 'day' | 'week' | 'month' | 'year') {
        return this.reactionService.getHot(period);
    }

    @Get('/recommend')
    async getRecommended(@Req() req) {
        const userTagIds = req.user?.tagIds || [];
        return this.reactionService.getRecommended(userTagIds);
    }

}
