DO $$ BEGIN
 CREATE TYPE "providers" AS ENUM('gmail', 'outlook');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providerAuthDetails" (
	"user_id" integer,
	"refreshToken" varchar(512) NOT NULL,
	"providers" "providers" NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(800),
	CONSTRAINT providerAuthDetails_user_id_providers_email PRIMARY KEY("user_id","providers","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "providerAuthDetails" ADD CONSTRAINT "providerAuthDetails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
