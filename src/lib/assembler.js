'use strict';

var log = require(__base + 'src/lib/log');
var speech = require(__base + 'src/lib/speech');
var gears = require(__base + 'config/gears.json');

module.exports = class Assembler {

   constructor() {
      this.core = {
         tasks: [],
         categories: [],
         handlers: []
      };
   }

   build() {
      this.loadGears(); 
      return this.core;
   }

   loadGears() {
      gears.forEach((gear, index) => this.loadGear(gears, gear, index));
   }

   loadGear(gears, gear, index) {
      logAddingGear(gears, gear, index);
      this.tryToLoad('tasks', gear, this.loadTasks);
      this.tryToLoad('categories', gear, this.loadCategories);
      this.tryToLoad('handlers', gear, this.loadHandlers);
   }

   tryToLoad(type, gear, assemble) {
      try {
         logInfoLoadingGear(type);
         assemble(gear, this);
      } catch (error) {
         logErrorLoadingGear(type, error);
      }
   }

   loadTasks(gear, self) {
      self.core.tasks = self.core.tasks.concat(require(self.tasksPath(gear)));
   }

   loadCategories(gear, self) {
      self.core.categories = self.core.categories.concat(require(self.categoriesPath(gear)));
   }

   loadHandlers(gear, self) {
      self.core.tasks.forEach(function(task) {
         if (!self.containsHandler(task.handler)) {
            var handler = require(self.handlersPath(gear, task.handler));
            self.core.handlers.push({ key: task.handler, process: handler.process});
         }
      });
   }

   containsHandler(handlerKey) {
      return this.core.handlers.find(h => h.key === handlerKey) != null;
   }
   
   tasksPath(gear) {
      return __gears + gear.key + '/config/tasks.json';
   }

   categoriesPath(gear) {
      return __gears + gear.key + '/config/categories.json';
   }

   handlersPath(gear, handler) {
      return __gears + gear.key + '/handlers/' + handler;
   }
}

function logStartAssembling() {
   log.info('Starting assembly hubot...');
}

function logAddingGear(gears, gear, index) {
   if (!gears) return log.error('Could not load gears.');
   if (!gear) return log.error('Could not load gear at index ' + index);
   log.info(speech.start('Adding gear ').refer(gear.key).progress(index + 1, gears.length).end());
}

function logInfoLoadingGear(gear) {
   log.info(speech.start(' > Loading ').append(gear).append('...').end());
}

function logErrorLoadingGear(gear, error) {
   log.error(speech.start(' > There was an error loading ').append(gear).append(' gear. This functionality can not be used.').end());
   log.error(error);
}
