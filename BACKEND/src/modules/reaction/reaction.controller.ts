// post-reaction.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('posts/:id/reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async addReaction(
    @Param('id') postId: string,
    @Body() body: { type: string },
  ) {
    await this.reactionService.setReaction(postId, body.type);
    return { message: 'Reaction added' };
  }

  @Get()
  async getReactions(@Param('id') postId: string) {
    return await this.reactionService.getReaction(postId);
  }
}
