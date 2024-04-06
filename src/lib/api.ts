import type { user } from '$lib/interfaces';
import prisma from '$lib/prisma';
import { get as getUsers } from '$lib/getUsers';

export async function get(request, response) {
    const users = await getUsers();
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(users));
}