CREATE TABLE IF NOT EXISTS "tournaments"."players" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"tournamentId" integer NOT NULL,
	"tournamentTeamId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tournaments"."players" ADD CONSTRAINT "players_tournamentId_tournaments_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tournaments"."players" ADD CONSTRAINT "players_tournamentTeamId_teams_id_fk" FOREIGN KEY ("tournamentTeamId") REFERENCES "tournaments"."teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tournaments"."players" ADD CONSTRAINT "players_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
