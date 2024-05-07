//Friend Page Server-Side Code
import prisma from '$lib/prisma';
import type { user, route } from '$lib/interfaces'
import { redirect } from '@sveltejs/kit';
import Filter from 'bad-words';

let filter = new Filter();

let user: user;
let route: route | null;
let invalid = true;

let privacySettings = [
    { value: 0, name: 'Private' },
    { value: 1, name: 'Friends Only' },
    { value: 2, name: 'Public' }
];


export const load = async ({ cookies, params }) => {
  const username = cookies.get('sessionId');
  // console.log(username);
  const route_id = parseInt(params.id);
    if(!route_id){
        invalid = true;
        redirect(302,'/routes');
    }


  if(!username){
    invalid = true;
    redirect(302,'../routes');
  }

  invalid = false;

  user = await prisma.user.findUnique({
    where: {
      username: username as string,
    },
  }) as user;

    if(!user){
        invalid = true;
        redirect(302,'../routes');
    }

    //Check if user is the owner of the route
    route = await prisma.routes.findUnique({
        where: {
            id: route_id,
        },
    });

    if(!route){
        invalid = true;
        redirect(302,'../routes');
    }
    // console.log(route.id);
    if(route.creator !== user.id){
        invalid = true;
        redirect(302,'../routes');
    }

    return {
        props: {
            user,
            route
        }
    }
}

//Actions
export const actions = {
    default: async ({ request }) => {
        if (!user || !route) {
            return {
                status: 400,
                body: {
                    message: "Invalid user or route"
                }
            }
        }
        let data = await request.formData();
        
        if (user && data.get("userID") !== user.id.toString()) {
            return {
                status: 400,
                body: {
                    message: "Invalid user ID"
                }
            }
        }
        if (route && data.get("routeID") !== route.id.toString()) {
            return {
                status: 400,
                body: {
                    message: "Invalid route ID"
                }
            }
        }
        if (data.get("type") === "editRoute") {
            if (data.get("routeName") === "") {
                return {
                    status: 400,
                    body: {
                        message: "Route name cannot be empty"
                    }
                }
            }
            let routeName: string | null = null;
            if (data.get("routeName")?.toString() != null) routeName = data.get("routeName")?.toString() || null;
            if (routeName != null && routeName.length > 25 && routeName.length < 1) {
                return {
                    status: 400,
                    body: {
                        message: "Route name must be between 1 and 25 characters"
                    }
                }
            }
            let length: number | null = null;
            const lengthValue = data.get("length")?.toString();
            if (lengthValue != null) length = parseInt(lengthValue) || null;

            let completionTime: number | null = null;
            const completionTimeValue = data.get("approximateTime")?.toString();
            if (completionTimeValue != null) completionTime = parseInt(completionTimeValue) || null;

            let publicity: number | null = null;
            const publicityValue = data.get("publicity")?.toString();
            if (publicityValue != null) publicity = parseInt(publicityValue) || null;
            if (publicity != null && publicity < 1 && publicity > 3) {
                return {
                    status: 400,
                    body: {
                        message: "Invalid publicity value"
                    }
                }
            }
            let cleanName = filter.clean(routeName);
            
            if (cleanName !== routeName) {
                return {
                    status: 400,
                    body: {
                        message: "Route name contains inappropriate words"
                    }
                }
            }
            else {

                if (routeName != null) {
                    let flag = false;
                let substring = routeName.substring(0, 25);
                //remove any spaces from the string
                let initTime = Date.now();
                substring = substring.replaceAll(/\s/g, '');
                for (let i = 0; i < substring.length; i++) {
                    for (let j = 0; j < 25; j++) {
                    substring = routeName.substring(i,i+j);
                    substring = substring.replaceAll(/\s/g, '');
                    if (filter.isProfane(substring)) flag = true;
                    if (flag) break;
                }
                if (flag) {
                    return {
                        status: 400,
                        body: {
                            message: "Route name contains inappropriate words"
                        }
                    }
                }
            }
        }}

            //update route
            let finalname: string;
            if (routeName != null) finalname = routeName;
            else finalname = route.route_name || 'Unnamed Route';
            route.route_name = finalname.substring(0, 25);
            let finallength: number;
            if (length != null) finallength = length;
            else finallength = route.length || 0;
            route.length = finallength;
            let finalcompletionTime: number;
            if (completionTime != null) finalcompletionTime = completionTime;
            else finalcompletionTime = route.approximate_completion_time || 0;
            route.approximate_completion_time = finalcompletionTime;
            let finalpublicity: number;
            if (publicity != null) finalpublicity = publicity;
            else finalpublicity = route.publicity || 3;
            route.publicity = finalpublicity;

            await prisma.routes.update({
                where: {
                    id: route.id
                },
                data: {
                    route_name: route.route_name ?? '',
                    length: route.length ?? undefined,
                    approximate_completion_time: route.approximate_completion_time,
                    publicity: route.publicity
                }
            });

            return {
                status: 200,
                body: {
                    message: "Route updated"
                }
            }
        }
        if (data.get("type") === "deleteRoute") {

            await prisma.routes.delete({
                where: {
                    id: route.id,
                    creator: user.id
                }
            });
            return {
                status: 200,
                body: {
                    message: "Route deleted"
                }
            }
        }
        return {
            status: 400,
            body: {
                message: "Invalid action"
            }
        }

}
}
