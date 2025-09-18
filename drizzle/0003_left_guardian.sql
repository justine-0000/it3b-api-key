CREATE TABLE "museum-project_api_keysapi_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"artist" varchar(256) NOT NULL,
	"image_url" text,
	"hashed_key" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "museum-project_api_keys" CASCADE;