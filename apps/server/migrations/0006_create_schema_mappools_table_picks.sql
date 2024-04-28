CREATE TABLE IF NOT EXISTS "mappools"."picks" (
	"artist" varchar NOT NULL,
	"beatmapId" integer NOT NULL,
	"beatmapSetId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"difficulty" varchar NOT NULL,
	"gameMode" "mappools"."gameMode" NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"mods" varchar(256) DEFAULT '' NOT NULL,
	"mapperName" varchar(16) NOT NULL,
	"mappoolId" integer NOT NULL,
	"title" varchar NOT NULL,
	"tournamentId" integer NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "mappools"."picks" ADD CONSTRAINT "picks_mappoolId_mappools_id_fk" FOREIGN KEY ("mappoolId") REFERENCES "mappools"."mappools"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "mappools"."picks" ADD CONSTRAINT "picks_tournamentId_tournaments_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
