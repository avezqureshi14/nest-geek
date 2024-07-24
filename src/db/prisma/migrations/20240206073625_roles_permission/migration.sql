CREATE TABLE IF NOT EXISTS modules (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS permissions (
    "id" SERIAL PRIMARY KEY,
    "module_id" INTEGER NOT NULL REFERENCES modules(id),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_permission_module" UNIQUE("module_id", "name")
);

CREATE TABLE IF NOT EXISTS roles (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE role_permissions (
    "id" SERIAL,
    "role_id" INTEGER NOT NULL REFERENCES roles(id),
    "permission_id" INTEGER NOT NULL REFERENCES permissions(id),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id","role_id", "permission_id")
);

CREATE TABLE user_permissions (
    "id" SERIAL,
    "user_id" UUID NOT NULL REFERENCES users(id),
    "permission_id" INTEGER NOT NULL REFERENCES permissions(id),
    "granted" BOOLEAN NOT NULL DEFAULT TRUE,
    "granted_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP WITHOUT TIME ZONE,
    PRIMARY KEY ("id", "user_id", "permission_id")
);


CREATE TABLE user_roles (
    "id" SERIAL,
    "user_id" UUID NOT NULL REFERENCES users(id),
    "role_id" INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY ("id", "user_id", "role_id")
);