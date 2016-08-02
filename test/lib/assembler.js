var expect  = require('chai').expect;
var setup  = require('../setup').start();
var Assembler = require('../../src/lib/assembler');

describe('Hubot Assembler', function() {
   describe('Hubot Assembler - Getting Paths', function() {
      it('should provide correct path for tasks', function() {
         var path = getAssembler().tasksPath({ key: 'test' });
         expect(path).to.equal(__gears + 'test/config/tasks.json');
      });

      it('should provide correct path for categories', function() {
         var path = getAssembler().categoriesPath({ key: 'test' });
         expect(path).to.equal(__gears + 'test/config/categories.json');
      });

      it('should provide correct path for handlers', function() {
         var path = getAssembler().handlersPath({ key: 'test' }, 'test-handler');
         expect(path).to.equal(__gears + 'test/handlers/test-handler');
      });
   });

   describe('Hubot Assembler - Utils', function() {
      it('should return true when handlers contains current handler', function() {
         var assembler = getAssembler();
         assembler.core.handlers.push({ key: 'test' });
         expect(assembler.containsHandler('test')).to.be.true;
      });

      it('should return false when handlers do not contains current handler', function() {
         var assembler = getAssembler();
         assembler.core.handlers.push({ key: 'test' });
         expect(assembler.containsHandler('anything-else')).to.be.false;
      });
   });

   describe('Hubot Assembler - Loader', function() {
      it('should load task file correctly', function() {
         var assembler = getAssembler();
         assembler.loadTasks({ key: 'test' }, assembler);
         expect(assembler.core.tasks).to.be.deep.equal([{
            "handler": "test-handler",
            "trigger": "test-trigger"
         }]);
      });

      it('should load category file correctly', function() {
         var assembler = getAssembler();
         assembler.loadCategories({ key: 'test' }, assembler);
         expect(assembler.core.categories).to.be.deep.equal([{
            "key": "test",
            "name": "test",
            "description": "some test",
            "visible": false
         }]);
      });

      it('should not load handler file if there is not tasks', function() {
         var assembler = getAssembler();
         assembler.loadHandlers({ key: 'test' }, assembler);
         expect(assembler.core.handlers).to.be.deep.equal([]);
      });

      it('should load handler file based on tasks handlers', function() {
         var assembler = getAssembler();
         assembler.loadTasks({ key: 'test' }, assembler);
         assembler.loadHandlers({ key: 'test' }, assembler);
         expect(assembler.core.handlers).to.have.lengthOf(1);
         expect(assembler.core.handlers[0].process().key).to.be.equal('test-process');
      });

      it('should not throw error loading gears', function() {
         var assembler = getAssembler();
         assembler.loadGear(null, null, null);
         expect(assembler.core).to.be.deep.equal({
            tasks: [],
            categories: [],
            handlers: []
         });
      });

      it('should not throw error loading invalid gear', function() {
         var assembler = getAssembler();
         assembler.loadGear([], { noKey: 'invalid' }, 0);
         expect(assembler.core).to.be.deep.equal({
            tasks: [],
            categories: [],
            handlers: []
         });
      });

      it('should load a valid gear', function() {
         var assembler = getAssembler();
         assembler.loadGear([], { key: 'test' }, 0);
         expect(assembler.core.tasks).to.be.deep.equal([{
            "handler": "test-handler",
            "trigger": "test-trigger"
         }]);
         expect(assembler.core.categories).to.be.deep.equal([{
            "key": "test",
            "name": "test",
            "description": "some test",
            "visible": false
         }]);
         expect(assembler.core.handlers).to.have.lengthOf(1);
         expect(assembler.core.handlers[0]).have.property('key').and.equal('test-handler');
      });
   });
});

function getAssembler() {
   return new Assembler();
}