


// ___________________Time based functions___________________________
export function getFormattedTimestamp() {
    const now = new Date();

    // Get date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');

    // Get time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Get milliseconds (converted to microseconds)
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const microseconds = milliseconds + '000'; // Extend to six digits

    // Combine into the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
}





// ___________________Date based functions___________________________

export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = now - date;

    // Convert time differences to minutes and hours
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));

    if (timeDiff < 1000 * 60) {
        // If less than a minute ago, return "Just now"
        return "Just now";
    } else if (timeDiff < 1000 * 60 * 60) {
        // If less than an hour ago, return in minutes
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (timeDiff < 1000 * 60 * 60 * 24) {
        // If less than a day ago, return in hours
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
        // Otherwise, format as "9 November 2024"
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
}



export function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } 
    if (hour >= 12 && hour < 18) {
        return "Good Afternoon";
    } 
    if (hour >= 18 && hour < 24) {
        return 'Good Evening'
    } 
    else {
        return "Good Night";
    }
}