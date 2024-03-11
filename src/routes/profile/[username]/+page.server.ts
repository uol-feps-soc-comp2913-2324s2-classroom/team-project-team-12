import prisma from "$lib/prisma";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load = (async ({ params: { username } }) => {

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) {
		error(404, {
			message: 'User not found'
		});
	}

    return user ;
}) satisfies PageServerLoad;