CREATE TABLE IF NOT EXISTS "matches"."rolls" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"matchId" integer NOT NULL,
	"roll" smallint NOT NULL,
	"tournamentId" integer NOT NULL,
	"tournamentsTeamId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."rolls" ADD CONSTRAINT "rolls_matchId_matches_id_fk" FOREIGN KEY ("matchId") REFERENCES "matches"."matches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."rolls" ADD CONSTRAINT "rolls_tournamentId_tournaments_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches"."rolls" ADD CONSTRAINT "rolls_tournamentsTeamId_teams_id_fk" FOREIGN KEY ("tournamentsTeamId") REFERENCES "tournaments"."teams"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
