var CronJob = require('cron').CronJob;
const recover = require('./past_recovery')

var job = new CronJob('40 5 * * *', recover.scrapdata);

module.exports = job.start();