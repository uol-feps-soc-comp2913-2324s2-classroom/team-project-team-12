import type { user } from '$lib/interfaces';
import prisma from '$lib/prisma';

let curUser: user;
let routes;

export const load = async ({ cookies }) => {
    const username = cookies.get('sessionId');

    curUser = await prisma.user.findUnique({
        where: {
            username: username as string,
        },
    }) as user;

    return {curUser};
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const type = data.get('type');

        if(type=="download"){
            try {
                const startDateStr = data.get('start');
                let startDate;
                
                if(startDateStr != null){
                    startDate = new Date(startDateStr.toString());
                }
    
                if(curUser){
                    const routeList = await prisma.routes.findMany({
                        where: {
                            creator: curUser.id,
                        },
                        include: {
                            route_coordinates: true // Include route coordinates for each route
                        }
                    });

                    routes = [];

                    for (let i = 0; i < routeList.length; i++) {
                        if(startDate && startDate <= routeList[i].created_on){
                            const longitudes = routeList[i].route_coordinates.map(coord => coord.longitude).join(',');
                            const latitudes = routeList[i].route_coordinates.map(coord => coord.latitude).join(',');
                            routes.push({
                                name: routeList[i].route_name,
                                created_on: routeList[i].created_on,
                                length: routeList[i].length,
                                completion_time: routeList[i].approximate_completion_time,
                                latitudes: latitudes,
                                longitudes: longitudes,
                            });
                        }
                    }

                    const formattedData = routes.map(route => ({
                        name: route.name,
                        created_on: route.created_on.toString(),
                        length: route.length,
                        'completion time': route.completion_time,
                        path: route.latitudes.split(',').map((latitude, index) => [parseFloat(latitude), parseFloat(route.longitudes.split(',')[index])]) // Parse strings to floats and create an array of [latitude, longitude] pairs
                    }));

                    console.log(formattedData);

                    const jsonData = JSON.stringify(formattedData, null, 2);

                    console.log(jsonData);

                    return {
                        status: 200,
                        body: jsonData
                    }
                }
            }
            catch (error){
                return 500;
            }
        }
    }
}