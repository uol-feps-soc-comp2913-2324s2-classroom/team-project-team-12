export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const type = data.get('type');

        if(type=="logout"){
            try {
                cookies.delete('sessionId', {
                    path: '/'
                });

                return {
                    status: 200
                }
            }
            catch (error) {
                return {
                    status: 500,
                    body: "Internal Server Error"
                }
            }
        }
    }
}