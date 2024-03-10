import { PrismaClient } from '@prisma/client';
import userData from './userdata.json' assert { type: 'json' };
import groupData from './groupdata.json' assert { type: 'json' };
import groupMembershipData from './groupmembershipdata.json' assert { type: 'json' };
import routesData from './routesdata.json' assert { type: 'json' };
import relationshipsData from './relationshipsdata.json' assert { type: 'json' };
import routeCoordinatesData from './routecoordinatesdata.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    for (const u of userData) {
        const user = await prisma.user.create({
            data: u.user,
        });
        console.log(`Created user with id: ${user.id}`);
    }

    for (const g of groupData) {
        const group = await prisma.groups.create({
            data: g.group,
        });
        console.log(`Created group with id: ${group.id}`);
    }

    for (const gm of groupMembershipData) {
        const groupMembership = await prisma.group_membership.create({
            data: gm.group_membership,
        });
        console.log(`Created group membership with id: ${groupMembership.id}`);
    }

    for (const r of routesData) {
        const route = await prisma.routes.create({
            data: r.route,
        });
        console.log(`Created route with id: ${route.id}`);
    }

    for (const rc of routeCoordinatesData) {
        const routeCoordinate = await prisma.route_coordinates.create({
            data: rc.route_coordinate,
        });
        console.log(`Created route coordinate with id: ${routeCoordinate.id}`);
    }

    for (const rel of relationshipsData) {
        const relationship = await prisma.relationship.create({
            data: rel.relationship,
        });
        console.log(`Created relationship with id: ${relationship.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
