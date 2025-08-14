-- AlterTable
ALTER TABLE "public"."members" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."membership_tiers" ALTER COLUMN "duration" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updatedAt" DROP DEFAULT;
