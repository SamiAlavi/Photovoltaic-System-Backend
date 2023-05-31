import cron from 'cron';

const job = new cron.CronJob('* * * * * *', () => {
  console.log(new Date());
});

// job.start();
