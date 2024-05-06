-- CreateTable
CREATE TABLE "groups_to_show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    CONSTRAINT "groups_to_show_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "groups_to_show_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "routes_to_show" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    CONSTRAINT "routes_to_show_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "routes_to_show_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "group_membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "request" BOOLEAN NOT NULL DEFAULT false,
    "member" BOOLEAN NOT NULL DEFAULT false,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "invite" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "group_membership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "group_membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "group_routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "group_routes_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "group_routes_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "creator" INTEGER NOT NULL,
    "publicity" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "groups_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "journey_coordinates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "journey_id" INTEGER NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "order_position" INTEGER NOT NULL,
    "time" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "journey_coordinates_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "journeys" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "journeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "started" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "finished" DATETIME,
    "label" TEXT,
    "is_route" BOOLEAN DEFAULT false,
    "route_id" INTEGER,
    CONSTRAINT "journeys_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "journeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "relationship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id1" INTEGER NOT NULL,
    "user_id2" INTEGER NOT NULL,
    "friend_request" BOOLEAN NOT NULL DEFAULT false,
    "is_friend" BOOLEAN NOT NULL DEFAULT false,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "relationship_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "relationship_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "route_coordinates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_id" INTEGER NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "order_position" INTEGER,
    CONSTRAINT "route_coordinates_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_name" TEXT NOT NULL,
    "created_on" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "length" INTEGER NOT NULL,
    "approximate_completion_time" INTEGER NOT NULL,
    "creator" INTEGER NOT NULL,
    "publicity" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "routes_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "membership_type" INTEGER NOT NULL DEFAULT 4,
    "subscription_start_date" DATETIME NOT NULL DEFAULT '2024-01-01 00:00:00 +00:00',
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "default_publicity" INTEGER NOT NULL DEFAULT 2,
    "admin_status" BOOLEAN NOT NULL DEFAULT false,
    "stripe_token" TEXT NOT NULL DEFAULT 'undefined',
    "subscription_id" TEXT NOT NULL DEFAULT 'undefined',
    "owner" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_groups_to_show_1" ON "groups_to_show"("id");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "groups_to_show_user_id_group_id_key" ON "groups_to_show"("user_id", "group_id");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_routesToShow_1" ON "routes_to_show"("id");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "routes_to_show_user_id_route_id_key" ON "routes_to_show"("user_id", "route_id");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_groups_1" ON "groups"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_groups_2" ON "groups"("name");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_journey_coordinates_1" ON "journey_coordinates"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_journeys_1" ON "journeys"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_route_coordinates_1" ON "route_coordinates"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_routes_1" ON "routes"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_1" ON "user"("id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_2" ON "user"("username");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_3" ON "user"("email");
Pragma writable_schema=0;
