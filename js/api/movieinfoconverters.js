function calculateMinutesToHours(movieMinutes) {
    let hours = Math.floor(movieMinutes / 60);
    let minutes = movieMinutes % 60;
    return hours + "H " + minutes + "M";
}

function get3dValue(is3d) {
    return (is3d) ? "3D" : "2D";
}

// Format date from (YYYY-MM-DD) to (Mon-DD-YYYY)
function formatDateToShortMonth(releaseDateString) {
    const date = new Date(releaseDateString);
    let month = date.toLocaleDateString('default', { month: 'short' });
    return month + " " + date.getDate() + ", " + date.getFullYear();
}

export {calculateMinutesToHours, get3dValue, formatDateToShortMonth};