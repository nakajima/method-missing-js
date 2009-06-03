# method-missing.js

Simulates Ruby's `method_missing` but in JavaScript.

## Usage

    function Receiver() {
      this.calls = [];
    }

    Receiver.prototype.methodMissing(sym, args) {
      args ?
        this.calls.push([sym, args]) :
        this.calls.push(sym);
    }

    var receiver = new Receiver();

    MM(receiver, function() {
      // this == receiver
      this.foo();
      this.bar()
      this.fizz('buzz');
    });

    receiver.calls[0] //=> 'foo'
    receiver.calls[1] //=> 'bar'
    receiver.calls[2] //=> ['fizz', ['buzz]]

    receiver.foo  //=> undefined
    receiver.bar  //=> undefined
    receiver.fizz //=> undefined
