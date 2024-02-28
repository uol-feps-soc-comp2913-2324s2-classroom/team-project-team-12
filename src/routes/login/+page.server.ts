import prisma from "$lib/prisma";
import { goto } from '$app/navigation';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const username = data.get("username");
    const password = data.get("password");
        
    if(data.get("type")=="login"){
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: username as string,
          },
        });
      
        if (user && user.password === password) {
          console.log('success');
          return {
            status: 200,
            body: { message: 'Authentication successful.' },
          };
        } else {
          console.log('fail');
          return {
            status: 401,
            body: { message: 'Invalid username or password.' },
          };
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        return {
          status: 500,
          body: { message: 'Internal Server Error.' },
        };
      }
    }else if(data.get("type")=="register"){
      try {
        const firstName = data.get("firstname");
        const lastName = data.get("lastname");
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");

        let users = [];
        users = await prisma.user.findMany();

        let valid = true;
        for(let i=0; i<users.length; i++){
          // check if username already exists
          if(users[i].username==username){
            valid = false;
          }
        }

        if(!valid){
          console.log('username already exists');
          return {
            status: 401,
            body: { message: 'Username already exists' },
          };
        }

        for(let i=0; i<users.length; i++){
          // check if email already exists
          if(users[i].email==email){
            valid = false;
          }
        }

        if(!valid){
          console.log('email already exists');
          return {
            status: 401,
            body: { message: 'Account using email address already exists.' },
          };
        }

        // check if email is valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailRegex.test(email as string);

        if(!valid){
          console.log('invalid email address');
          return {
            status: 401,
            body: { message: 'Invalid Email Address' },
          };
        }

        // everything should be right, so create account
        await prisma.user.create({
          data: {
              username: username as string,
              first_name: firstName as string,
              last_name: lastName as string,
              email: email as string,
              password: password as string,
          },
        });

        return {
          status: 200,
          body: { message: 'Account created.' },
        };

      } catch (error) {
        console.error('Error during authentication:', error);
        return {
          status: 500,
          body: { message: 'Internal Server Error.' },
        };
      }
    }
  },
};