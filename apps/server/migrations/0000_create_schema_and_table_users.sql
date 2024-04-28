CREATE SCHEMA "users";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"gameUserId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_gameUserId_unique" UNIQUE("gameUserId")
);
