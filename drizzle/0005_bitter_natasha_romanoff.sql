CREATE TABLE "it3b-api-key_api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"period" varchar(100) NOT NULL,
	"origin" varchar(100) NOT NULL,
	"value" integer NOT NULL,
	"image_url" text,
	"hashed_key" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "it3b-api-key_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tier" varchar(20) DEFAULT 'free' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"request_limit" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "it3b-api-key_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP TABLE "museum-project_api_keys" CASCADE;