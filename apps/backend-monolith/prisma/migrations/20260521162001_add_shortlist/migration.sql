-- AlterEnum
ALTER TYPE "MatchStatus" ADD VALUE 'PASSED';

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "shortlist" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "saved_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortlist_user_id_saved_profile_id_key" ON "shortlist"("user_id", "saved_profile_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
