import prisma from '$lib/prisma';
import { json, redirect } from '@sveltejs/kit';

// Returns a valid header for a GPX file
const gpxHeader = (username: string) => {
    return `\
<?xml version="1.0"?>
<gpx
\tversion="1.0"
\tcreator="Journeys"
\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
\txmlns="http://www.topografix.com/GPX/1/0"
\txsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">
\t<name>Journeys - ${username}'s Exported Data</name>
`;
};

export const actions = {
    default: async ({ request, cookies }) => {
        const username = cookies.get('sessionId');

        if (username == undefined) throw redirect(302, '/login');

        // Get the user's ID
        const user = await prisma.user.findUnique({ where: { username } });
        const userId = user?.id;

        const data = await request.formData();
        const period = data?.get('start');

        let startDate = new Date(period.toString());

        const routes = await prisma.routes.findMany({
            where: { creator: userId },
            include: { route_coordinates: true },
        });

        const filteredRoutes = routes.filter((r) => startDate <= r.created_on);

        let result = gpxHeader(username);

        // Export each route
        filteredRoutes.forEach((r) => {
            result += '<rte>\n';
            result += `\t<name>${r.route_name}</name>\n`;

            // Export each point in the route
            r.route_coordinates.forEach((p, i) => {
                result += `\t<rtept lat="${p.latitude}" lon="${p.longitude}">`;

                if (i == 0) result += `<time>${r.created_on.toISOString()}</time>`;
                if (i == r.route_coordinates.length - 1)
                    result += `<time>${new Date(+r.created_on + r.approximate_completion_time * 1000).toISOString()}</time>`;

                result += '</rtept>\n';
            });

            result += '</rte>\n';
        });

        // Terminate the file correctly
        result += '</gpx>';

        return {
            status: 200,
            body: result,
            'content-type': 'application/xml',
        };
    },
};
