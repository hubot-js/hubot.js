'use strict';

exports.callJob = callJob;

var jenkinsOptions = {
   baseUrl: process.env.JENKINS_AUTH_URL,
   promisify: true      
}  

var jenkins = require('jenkins')(jenkinsOptions);

function callJob(jobName) {
   return jenkins.job.build(jobName);
}
