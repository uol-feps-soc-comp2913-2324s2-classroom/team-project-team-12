import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
if (prisma) {
  console.log('prisma connected');
} else {
    console.log('prisma not connected');
    };
export default prisma;
