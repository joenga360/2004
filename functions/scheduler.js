const cron = require('node-cron')

const { notifyEmployers, notifyStudents } = require('./helpers/notifications')

const scheduler = () => {
    return { 
        
        alertDaily: () => {
            cron.schedule('0 9 * * *', () => {
                //console.log('running a task DAILY');
                //console.log('what is in here? ', notifyEmployers)
                notifyStudents(1) 
                notifyEmployers(1)              
            })
        },

        alertWeekly: () => {
            cron.schedule('0 8 * * 1', () => {
  
                notifyStudents(7)
                notifyEmployers(7)
            })
        }
    }
}

module.exports = scheduler()