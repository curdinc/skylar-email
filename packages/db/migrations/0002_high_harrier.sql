ALTER TABLE "inviteCode" DROP CONSTRAINT "inviteCode_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
