export const load = ({ cookies }) => {
    return {
        user: cookies.get('sessionId'),
    };
};
