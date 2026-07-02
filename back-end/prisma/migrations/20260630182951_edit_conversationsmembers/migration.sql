-- AlterTable
ALTER TABLE "ConversationMember" ALTER COLUMN "lastReadedMessageId" DROP NOT NULL,
ALTER COLUMN "lastDeliveredMessageId" DROP NOT NULL;
