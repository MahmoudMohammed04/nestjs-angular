import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { createGroupDto } from './dto/createConversation.dto';

@ApiTags('conversation')
@ApiBearerAuth('Bearer')
@UseGuards(AuthGuard('firebase'))
@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
  ) {}

  
  @Get()
  getUserConversations(@Req() req) {
    return this.conversationService.getConversationsByUserId(
      req.user.user_id,
    );
  }

 
  @Get(':id/messages')
  getConversationMessages(
    @Param('id') conversationId: string,
  ) {
    return this.conversationService.getConversationMessages(
      Number(conversationId),
    );
  }

  
  @Post('one-to-one')
  @ApiBody({
    schema: {
      example: {
        receiverId: 'firebase-user-id',
      },
    },
  })
  createOneToOne(
    @Req() req,
    @Body() body: { receiverId: string },
  ) {
    return this.conversationService.createConversationOneToOne(
      req.user.user_id,
      body.receiverId,
    );
  }

  
  @Post('group')
  createGroup(
    @Req() req,
    @Body() dto: createGroupDto,
  ) {
    return this.conversationService.createConversationGroup(
      req.user.user_id,
      dto,
    );
  }


  @Post(':id/add-user')
  @ApiBody({
    schema: {
      example: {
        userId: 'firebase-user-id',
      },
    },
  })
  addUserToConversation(
    @Param('id') conversationId: string,
    @Body() body: { userId: string },
  ) {
    return this.conversationService.addUserToConversation(
      Number(conversationId),
      body.userId,
    );
  }

  
  @Delete(':id/remove-user/:userId')
  removeUserFromConversation(
    @Param('id') conversationId: string,
    @Param('userId') userId: string,
  ) {
    return this.conversationService.removeUserFromConversation(
      Number(conversationId),
      userId,
    );
  }
}