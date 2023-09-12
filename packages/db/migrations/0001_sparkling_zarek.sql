CREATE TABLE IF NOT EXISTS "inviteCode" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviteCode" text NOT NULL,
	"userId" integer,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"usedAt" timestamp with time zone,
	CONSTRAINT "inviteCode_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"imageUri" text,
	"name" text NOT NULL,
	"providers" text[],
	"phone" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
