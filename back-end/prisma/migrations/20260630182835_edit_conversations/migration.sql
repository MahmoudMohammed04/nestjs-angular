-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "lastMessageId" DROP NOT NULL,
ALTER COLUMN "lastMessageTime" DROP NOT NULL;
