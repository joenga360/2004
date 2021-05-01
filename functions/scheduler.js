const cron = require('node-cron')

const { notifyEmployers, notifyStudents } = require('./helpers/notifications')

const scheduler = () => {
    return {
        start: () => {
            cron.schedule('* * * * * *', () => {
                //console.log('running a task every minute at the 5th second');
                //console.log('what is in here? ', notifyEmployers)
                notifyStudents()
                notifyEmployers()
            })
        }
    }
}

module.exports = scheduler()