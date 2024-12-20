
// Time dirrefance functions 


export function getMinutesDifference(startDate, endDate) {
    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert milliseconds to minutes
    const diffInMinutes = diffInMs / (1000 * 60);

    // Return the difference as an integer
    return Math.round(diffInMinutes);
}



export function getPassedTime(dateString) {
    if (dateString === 'Not studied yet.') {
        return 'Not studied yet.';
    }
    const parts = dateString.split(/[/ :]/);
    const date = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);

    const now = new Date();
    const passedTime = now - new Date(date);
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day; 
    const year = 365 * day;

    if (passedTime < minute) {
        return 'now'
    }
    if (passedTime < hour) {
        return `Last studied ${Math.floor(passedTime / minute)}m ago`;
    } else if (passedTime < day) {
        return `Last studied ${Math.floor(passedTime / hour)}h ago`;
    } else if (passedTime < week) {
        return `Last studied ${Math.floor(passedTime / day)}d ago`;
    } else if (passedTime < month) {
        return `Last studied ${Math.floor(passedTime / week)}w ago`;
    } else if (passedTime < year) {
        return `Last studied ${Math.floor(passedTime / month)}mo ago`;
    } else {
        return `Last studied ${Math.floor(passedTime / year)}y ago`;
    }
}



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






// ___________________GREETINGS based on time of day___________________

export function greetHomeScreen() {
    const stellarBodyStyles = { 'Good Morning': 'morning-sun', 'Good Afternoon': 'afternoon-sun', 'Good Evening': 'evening-sun', 'Good Night': 'night-moon' }
    const greetingText = greetBasedOnTime();

    const stellarIllustrationDiv = document.createElement('div');
    const stellarIllustration = document.createElement('div');
    const greetingSpan = document.createElement('span');

    greetingSpan.textContent = greetingText;
    stellarIllustrationDiv.classList.add('time-of-day-art');
    stellarIllustration.classList.add(stellarBodyStyles[greetingText]);
    stellarIllustrationDiv.appendChild(stellarIllustration);

    document.querySelector('.view-title').append(greetingSpan, stellarIllustrationDiv)
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