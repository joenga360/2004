const Course = require('../models/course')
const Job = require('../models/job')

const notificationsWorkerFactory = function () {
  return {
    run: function () {
      //[ Course.selectCourses(), Job.selectJobs() ] 
      Course.selectCourses();
    }
  };
};

module.exports = notificationsWorkerFactory();