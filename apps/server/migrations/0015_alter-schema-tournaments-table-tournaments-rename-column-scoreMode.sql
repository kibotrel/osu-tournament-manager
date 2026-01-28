ALTER TYPE "tournaments"."scoreMode" RENAME TO "winConditionEnum";--> statement-breakpoint
ALTER TABLE "tournaments"."tournaments" RENAME COLUMN "scoreMode" TO "winCondition";--> statement-breakpoint
ALTER TABLE "tournaments"."tournaments" ALTER COLUMN "winCondition" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "tournaments"."winConditionEnum";--> statement-breakpoint
CREATE TYPE "tournaments"."winConditionEnum" AS ENUM('Accuracy', 'Combo', 'Score', 'ScoreV2');--> statement-breakpoint
ALTER TABLE "tournaments"."tournaments" ALTER COLUMN "winCondition" SET DATA TYPE "tournaments"."winConditionEnum" USING "winCondition"::"tournaments"."winConditionEnum";--> statement-breakpoint
ALTER TABLE "tournaments"."tournaments" ALTER COLUMN "teamMode" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "tournaments"."teamMode";--> statement-breakpoint
CREATE TYPE "tournaments"."teamMode" AS ENUM('HeadToHead', 'TagCoOp', 'TagTeamVs', 'TeamVs');--> statement-breakpoint
ALTER TABLE "tournaments"."tournaments" ALTER COLUMN "teamMode" SET DATA TYPE "tournaments"."teamMode" USING "teamMode"::"tournaments"."teamMode";