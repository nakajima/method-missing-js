// method-missing-js
(function($) {
  function MM(receiver, fn, replaced) {
    replaced = replaced || [];
    try { fn.call(receiver); }
    catch(e) {

      // If methodMissing not defined, just re-throw error.
      if (!receiver.methodMissing) { throw(e); }

      // Find the missing key...
      var missed = fn.toString().match(/this\.(\w+)/)[1];

      // Add it to list of keys replaced so far...
      replaced.push(missed);

      // Define key to use method missing.
      receiver[missed] = function() {
        var a = [missed];
        var i = arguments.length;
        while(i--) { a.push(arguments[i]); }
        receiver.methodMissing.apply(receiver, a);
      }

      // Try again.
      MM(receiver, fn, replaced)
    }

    // Clear replaced keys
    var i = replaced.length;
    while(i--) { delete(receiver[replaced[i]]); }
  }

  window.MM = MM;
})(jQuery);
