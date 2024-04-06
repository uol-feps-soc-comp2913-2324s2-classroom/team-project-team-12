
import prisma from '$lib/prisma';

export const GET = async () => {
    try {
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500});
    }
};