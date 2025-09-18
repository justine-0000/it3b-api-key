ALTER TABLE "it3b-api-key_api_keys" RENAME TO "museum-project_api_keys";--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" ADD COLUMN "artist" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "museum-project_api_keys" ADD COLUMN "image_url" text;