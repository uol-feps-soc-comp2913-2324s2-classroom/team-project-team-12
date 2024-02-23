import { PrismaClient } from '@prisma/client';
import userData from './userdata.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    for (const p of userData) {
        const user = await prisma.user.create({
            data: {
                username: p.user.username,
                first_name: p.user.first_name,
                last_name: p.user.last_name,
                email: p.user.email,
                password: p.user.password,
            },
        });
        console.log(`Created user with id: ${user.id}`);
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
