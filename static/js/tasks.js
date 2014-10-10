/**
 * Created by ANDREW on 10/10/2014.
 */
var Task = (function (){

	Task.prototype.then = function(newTask){

	};

	Task.prototype.run = function(){
		var args = arguments;
		var _nextTask = {}/* */;
		var _inFn, _doFn, _outFn = _nextTask.run, _resFn;
		_resFn = this.fn(function(suppliedInFn){
			_inFn = suppliedInFn;
		}, function(suppliedDoFn){
			_doFn = suppliedDoFn;
		}, _outFn);

		_inFn.apply(this, args);
		_doFn.call(this);

		_resFn.call(this);

	};

	return function Task(fn){
		if (!this instanceof Task) return new Task(fn);
		this.fn = fn;
	};


})();


var task1 = Task(function(inFn, doFn, outFn){
	var a, b, c, s;
	inFn(function(_a, _b, _c){
		a = _a;
		b = _b;
		c = _c;
	});

	doFn(function(){
		s = a + b + c;
	});

	return function(){
		outFn(s);
	};
});

var task2 = task1.then(Task(function(inFn, doFn, outFn){
	var s;
	inFn(function(){});
	doFn(function(){

	});
	return function(){
		outFn();
	};
}));