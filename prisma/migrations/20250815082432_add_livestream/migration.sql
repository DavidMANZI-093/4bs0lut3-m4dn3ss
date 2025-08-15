-- CreateTable
CREATE TABLE "public"."live_streams" (
    "id" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "live_streams_pkey" PRIMARY KEY ("id")
);
