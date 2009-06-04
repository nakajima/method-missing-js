Screw.Unit(function() {
  describe("method-missing-js", function() {
    function Receiver() {
      this.calls = [];
    };

    Receiver.prototype.foo = function() {
      this.calls.push('foo');
    }

    Receiver.prototype.methodMissing = function(sym, args) {
      if (args) { this.calls.push([sym, args]) }
      else      { this.calls.push(sym); }
    }

    var receiver;

    before(function() {
      receiver = new Receiver();
    });

    it("calls the function", function() {
      MM(receiver, function() { this.foo(); });
      expect(receiver.calls[0]).to(equal, 'foo');
    });

    it("delegates missing method calls to methodMissing", function() {
      MM(receiver, function() {
        this.bar();
        this.fizz();
      });
      expect(receiver.calls[0]).to(equal, 'bar');
      expect(receiver.calls[1]).to(equal, 'fizz');
    });

    it("removes methodMissing from receiver after", function() {
      MM(receiver, function() { this.bar(); });
      expect(receiver.bar).to(be_undefined);
    });

    it("allows bracket calls", function() {
      MM(receiver, function() {
        this['fizz']();
        this['buzz']();
      });
      expect(receiver.calls[0]).to(equal, 'fizz');
      expect(receiver.calls[1]).to(equal, 'buzz');
    });

    it("mixes and matches", function() {
      MM(receiver, function() {
        this['buzz']();
        this.fizz();
      });
      expect(receiver.calls[1]).to(equal, 'buzz');
      expect(receiver.calls[0]).to(equal, 'fizz');
    });

    it("only delegates when methodMissing exists", function() {
      var err = false;
      try { MM({}, function() { this.bar() }); }
      catch(e) { err = true; }
      expect(err).to(be_true);
    });

    it("provides arguments", function() {
      MM(receiver, function() { this.fizz('buzz') });
      expect(receiver.calls[0][0]).to(equal, 'fizz');
      expect(receiver.calls[0][1]).to(equal, 'buzz');
    });
  });
});
