CREATE TABLE IF NOT EXISTS "matches"."scores" (
	"accuracy" double precision NOT NULL,
	"countGood" integer DEFAULT 0 NOT NULL,
	"countGreat" integer DEFAULT 0 NOT NULL,
	"countMeh" integer DEFAULT 0 NOT NULL,
	"countMiss" integer DEFAULT 0 NOT NULL,
	"countOk" integer DEFAULT 0 NOT NULL,
	"countPerfect" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"mappoolPickId" integer NOT NULL,
	"matchId" integer NOT NULL,
	"maxCombo" integer NOT NULL,
	"score" integer NOT NULL,
	"tournamentPlayerId" integer NOT NULL,
	"tournamentTeamId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."scores" ADD CONSTRAINT "scores_mappoolPickId_picks_id_fk" FOREIGN KEY ("mappoolPickId") REFERENCES "mappools"."picks"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."scores" ADD CONSTRAINT "scores_matchId_matches_id_fk" FOREIGN KEY ("matchId") REFERENCES "matches"."matches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."scores" ADD CONSTRAINT "scores_tournamentPlayerId_players_id_fk" FOREIGN KEY ("tournamentPlayerId") REFERENCES "tournaments"."players"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "matches"."scores" ADD CONSTRAINT "scores_tournamentTeamId_teams_id_fk" FOREIGN KEY ("tournamentTeamId") REFERENCES "tournaments"."teams"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
