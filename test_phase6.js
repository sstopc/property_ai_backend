const SiteVisitScheduler = require('./scheduler');

console.log("🚀 Launching Phase 6 Scheduling Engine Verification Suite...\n");

// 1. SCENARIO A: A booking scheduled 2 days from now (Expected: Both reminder windows trigger true)
const twoDaysFromNow = new Date();
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

const testRunA = SiteVisitScheduler.calculateReminderWindows("VISIT-HYD-001", twoDaysFromNow.toISOString());
console.log("Output Matrix A:", JSON.stringify(testRunA, null, 2));


// 2. SCENARIO B: A booking scheduled just 4 hours from now (Expected: 24h skipped, morning-of true)
const fourHoursFromNow = new Date();
fourHoursFromNow.setHours(fourHoursFromNow.getHours() + 4);

const testRunB = SiteVisitScheduler.calculateReminderWindows("VISIT-KOND-002", fourHoursFromNow.toISOString());
console.log("Output Matrix B:", JSON.stringify(testRunB, null, 2));

console.log("\n🏁 End of validation execution loop.");