class SiteVisitScheduler {
    /**
     * Analyzes appointment timestamp matrices to calculate background processing offsets.
     * @param {string} visitId - Unique row locator
     * @param {string} visitTimestampIso - ISO formatted appointment time
     */
    static calculateReminderWindows(visitId, visitTimestampIso) {
        const currentTime = new Date(); // Internal baseline context clock
        const visitTime = new Date(visitTimestampIso);

        const msPerDay = 24 * 60 * 60 * 1000;
        const timeDifference = visitTime.getTime() - currentTime.getTime();

        console.log(`\n🗓️ Analyzing Schedule Profiles for Visit ID: ${visitId}`);
        console.log(`⏱️ Remaining time window until target walk-through: ${(timeDifference / (1000 * 60 * 60)).toFixed(2)} hours`);

        // If the visit is booked more than 24 hours in advance, queue up the full multi-touch confirmation loop
        if (timeDifference > msPerDay) {
            console.log(`✅ Status: 24-Hour Buffer verified. Queueing confirmation milestone wrapper.`);
            return { visitId, queue24h: true, queueMorningOf: true };
        }

        // On short-notice bookings, skip the 24h buffer and set up the morning-of notification immediately
        console.log(`⚡ Short-Notice booking verified (< 24h). Queueing morning-of transit alerts directly.`);
        return { visitId, queue24h: false, queueMorningOf: true };
    }
}

module.exports = SiteVisitScheduler;
