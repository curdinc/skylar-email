CREATE TABLE IF NOT EXISTS "inviteCode" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviteCode" text NOT NULL,
	"userId" integer NOT NULL,
	"usedByUserId" integer,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"usedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "inviteCode_inviteCode_unique" UNIQUE("inviteCode"),
	CONSTRAINT "inviteCode_usedByUserId_unique" UNIQUE("usedByUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"providerId" text NOT NULL,
	"provider" text NOT NULL,
	"imageUri" text DEFAULT '',
	"name" text DEFAULT '',
	"email" text DEFAULT '',
	"phone" text DEFAULT '',
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_providerId_unique" UNIQUE("providerId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "providerIdx" ON "user" ("providerId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_usedByUserId_user_id_fk" FOREIGN KEY ("usedByUserId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
