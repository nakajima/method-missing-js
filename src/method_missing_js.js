// method-missing-js
(function($) {
  function MM(receiver, fn, replaced) {
    replaced = replaced || [];
    var callCounts = {};
    try { fn.call(receiver); }
    catch(e) {
      // If methodMissing not defined, just re-throw error.
      if (!receiver.methodMissing) { throw(e); }

      // Find all method calls
      var str = fn.toString();
      var keys = str.match(/this\.(\w+)/g);

      function replaceKey(key) {
        key = key.split('.')[1];
        var called = false;

        // Ensure things get called only as many times as they should
        if (!callCounts[key]) { callCounts[key] = 0; }
        var allowedCount = str.match(new RegExp(key, 'g')).length;

        // Find the missing key...
        if (replaced.indexOf(key) > -1) {
          return;
        }

        // Add it to list of keys replaced so far...
        replaced.unshift(key);

        // Define key to use method missing.
        receiver[key] = function() {
          if (++callCounts[key] <= allowedCount) {
            var a = [key];
            if (i = arguments.length) { while(i--) { a.push(arguments[i]); } }
            receiver.methodMissing.apply(receiver, a);
          }
        }
      }

      // Find the missing key...
      var i = keys.length;
      while(i--) { replaceKey(keys[i]); }

      // Try again.
      MM(receiver, fn, replaced)
    }

    // Clear replaced keys
    var i = replaced.length;
    while(i--) { delete(receiver[replaced[i]]); }
  }

  window.MM = MM;
})(jQuery);
