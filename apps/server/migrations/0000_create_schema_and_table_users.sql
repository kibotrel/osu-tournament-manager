CREATE SCHEMA "users";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."users" (
	"avatarUrl" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"gameUserId" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_gameUserId_unique" UNIQUE("gameUserId")
);
