CREATE TABLE IF NOT EXISTS "matches"."events" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"type" "matches"."draftType" NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"mappoolPickId" integer NOT NULL,
	"matchId" integer NOT NULL,
	"tournamentsTeamId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."events" ADD CONSTRAINT "events_mappoolPickId_picks_id_fk" FOREIGN KEY ("mappoolPickId") REFERENCES "mappools"."picks"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."events" ADD CONSTRAINT "events_matchId_matches_id_fk" FOREIGN KEY ("matchId") REFERENCES "matches"."matches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."events" ADD CONSTRAINT "events_tournamentsTeamId_teams_id_fk" FOREIGN KEY ("tournamentsTeamId") REFERENCES "tournaments"."teams"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
