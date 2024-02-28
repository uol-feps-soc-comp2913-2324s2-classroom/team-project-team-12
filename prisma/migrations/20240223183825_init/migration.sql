-- CreateTable
CREATE TABLE "group_routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group_id" INTEGER,
    "route_id" INTEGER,
    CONSTRAINT "group_routes_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "group_routes_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "creator" INTEGER,
    "publicity" INTEGER DEFAULT 2,
    CONSTRAINT "groups_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "journey_coordinates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "journey_id" INTEGER,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "order_position" INTEGER,
    "time" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "journey_coordinates_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "journeys" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "journeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "started" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "finished" DATETIME,
    "label" TEXT,
    "is_route" INTEGER DEFAULT 0,
    "route_id" INTEGER,
    CONSTRAINT "journeys_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "journeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "relationship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id1" INTEGER,
    "user_id2" INTEGER,
    "friend_request" INTEGER DEFAULT 0,
    "is_friend" INTEGER DEFAULT 0,
    "is_blocked" INTEGER DEFAULT 0,
    CONSTRAINT "relationship_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "relationship_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "route_coordinates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_id" INTEGER,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "order_position" INTEGER,
    CONSTRAINT "route_coordinates_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_name" TEXT NOT NULL,
    "created_on" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "length" INTEGER,
    "approximate_completion_time" INTEGER,
    "creator" INTEGER,
    "publicity" INTEGER DEFAULT 2,
    CONSTRAINT "routes_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "membership_type" INTEGER,
    "next_payment" DATETIME,
    "default_publicity" INTEGER DEFAULT 2,
    "admin_status" INTEGER,
    "stripe_token" TEXT
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_groups_1" ON "groups"("id");
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
