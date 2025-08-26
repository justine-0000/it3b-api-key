CREATE TABLE "it3b-api-key_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"hashed_key" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL
);
