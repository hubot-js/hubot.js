'use strict';

exports.build = build;

var log = require(__base + 'src/lib/log');
var speech = require(__base + 'src/lib/speech');
var gears = require(__base + 'config/gears.json');

function build() {
   var core = newCore();

   loadGears(core); 
   
   return core;
}

function loadGears(core) {
   gears.forEach((gear, index) => loadGear(core, gears, gear, index));
}

function loadGear(core, gears, gear, index) {
   log.info(speech.start('Adding gear ').refer(gear.key).progress(index + 1, gears.length).end());

   tryToLoad('tasks', core, gear, loadTasks);
   tryToLoad('categories', core, gear, loadCategories);
   tryToLoad('handlers', core, gear, loadHandlers);
}

function tryToLoad(type, core, gear, assemble) {
   try {
      logInfoLoadingGear(type);
      assemble(core, gear);
   } catch (error) {
      logErrorLoadingGear(type, error);
   }
}

function loadTasks(core, gear) {
   core.tasks = core.tasks.concat(require(tasksPath(gear)));
}

function loadCategories(core, gear) {
   core.categories = core.categories.concat(require(categoriesPath(gear)));
}

function loadHandlers(core, gear) {
   core.tasks.forEach(function(task) {
      if (!handlerContains(core.handlers, task.handler)) {
         var handler = require(handlerPath(gear, task.handler));
         core.handlers.push({ key: task.handler, process: handler.process});
      }
   });
}

function tasksPath(gear) {
   return __gears + gear.key + '/config/tasks.json';
}

function categoriesPath(gear) {
   return __gears + gear.key + '/config/categories.json';
}

function handlerPath(gear, handler) {
   return __gears + gear.key + '/handlers/' + handler;
}

function handlerContains(handlers, handlerKey) {
   return handlers.find(h => h.key === handlerKey) != null;
}

function newCore() {
   log.info('Starting assembly hubot...');
   return {
      tasks: [],
      categories: [],
      handlers: []
   };  
}

function logInfoLoadingGear(gear) {
   log.info(speech.start(' > Loading ').append(gear).append('...').end());
}

function logErrorLoadingGear(gear, error) {
   log.error(speech.start(' > There was an error loading ').append(gear).append(' gear. This functionality can not be used.').end());
   log.error(error);
}
