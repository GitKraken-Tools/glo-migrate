export const getTimeRemaining = (createdOn) => {
    const date_now = new Date().getTime();
    const date_future = new Date(createdOn).getTime() + 1800000; // 30 minutes
    if (date_future < date_now) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = Math.floor(delta % 60)
    return { days, hours, minutes, seconds }
}