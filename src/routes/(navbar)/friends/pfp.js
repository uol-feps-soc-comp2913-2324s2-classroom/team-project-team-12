export function getDefaultProfilePictureUrl(user) {
    // Define the hash function
    function hashUserId(userId) {
        return (userId * 2654435761) % Math.pow(2, 32);
    }

    // Define the function to get random color
    function getRandomColor(userId) {
        const hashedUserId = hashUserId(userId);
        const color = hashedUserId.toString(16).slice(-6); // Convert to hexadecimal and take the last 6 characters
        return color;
    }

    // Define the function to get initials
    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    // Generate profile picture URL
    const initials = getInitials(user.first_name, user.last_name || '');
    const color = getRandomColor(user.id);
    const imageSize = 200; // Adjust this size according to your requirement
    const imageUrl = `https://ui-avatars.com/api/?name=${initials}&background=${color}&size=${imageSize}`;

    return imageUrl;
}
