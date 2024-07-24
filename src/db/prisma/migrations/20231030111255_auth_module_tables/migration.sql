
-- Create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');
CREATE TYPE providers AS ENUM ('Google', 'Facebook', 'LinkedIn', 'Apple');
CREATE TYPE gender AS ENUM ('Male', 'Female', 'Others');

-- Create table
CREATE TABLE IF NOT EXISTS users (
    "id" UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE,
    "password" VARCHAR(255), -- for storing hashed password
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "gender" gender,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "email_verified" BOOLEAN DEFAULT FALSE,
    "last_login" TIMESTAMP,
    "avatar" VARCHAR(255),
    "phone_number" VARCHAR(20) UNIQUE, -- assuming a max length of 20 for phone numbers
    "reset_token" TEXT,
    "role" user_role DEFAULT 'user',
    "is_active" BOOLEAN DEFAULT TRUE,
    "reset_token_expiry" TIMESTAMP,
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "country" VARCHAR(255)
);

-- Create an index on the email column
CREATE INDEX "idx_users_email" ON "users"("email");



-- Create identifiers TABLE
CREATE TABLE oauth_identities (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES users(id),
    "provider_name" providers NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT "uq_provider_identity" UNIQUE("provider_name", "provider_id"),
    CONSTRAINT "uq_user_provider" UNIQUE("user_id", "provider_name")
);


-- Create an index on the user_id column
CREATE INDEX "idx_oauth_identities_user_id" ON "oauth_identities"("user_id");

-- Create an index on the provider_name column
CREATE INDEX "idx_oauth_identities_provider_name" ON "oauth_identities"("provider_name");


-- Create user_otps table
CREATE TABLE user_otps (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES users(id),
    "otp_value" VARCHAR(255) NOT NULL,
    "count" INTEGER DEFAULT 0,
    "expires_at" TIMESTAMP WITHOUT TIME ZONE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "is_used" BOOLEAN DEFAULT FALSE,
    "purpose" VARCHAR(255),
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Create an index on the user_id column
CREATE INDEX idx_user_otps_user_id ON "user_otps"("user_id");

