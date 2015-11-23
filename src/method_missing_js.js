// method-missing-js
(function() {
  "use strict";

  function MM(receiver, fn, replaced) {
    replaced = replaced || [];
    var replaceIdx;
    try { fn.call(receiver); }
    catch(e) {
      // If methodMissing not defined, just re-throw error.
      if (!receiver.methodMissing) { throw(e); }

      // Find all method calls
      var fnBodyStr = fn.toString();
      var keys = fnBodyStr.match(/this\.(\w+)/g);

      // Find the missing key...
      replaceIdx = keys.length;
      while(replaceIdx--) { replaceKey(keys[replaceIdx], receiver, replaced, fnBodyStr); }

      // Try again.
      MM(receiver, fn, replaced)
    }

    // Clear replaced keys
    replaceIdx = replaced.length;
    while(replaceIdx--) { delete(receiver[replaced[replaceIdx]]); }
  }

  function replaceKey(key, receiver, replaced, fnBodyStr) {
    var callCounts = {};
    key = key.split('.')[1];

    // Ensure things get called only as many times as they should
    if (!callCounts[key]) { callCounts[key] = 0; }
    var allowedCount = fnBodyStr.match(new RegExp(key, 'g')).length;

    // Find the missing key...
    if (replaced.indexOf(key) > -1) {
      return;
    }

    // Add it to list of keys replaced so far...
    replaced.unshift(key);

    // Define key to use method missing.
    receiver[key] = function() {
      var argIdx;
      if (++callCounts[key] <= allowedCount) {
        var a = [key];
        if (argIdx = arguments.length) { while(argIdx--) { a.push(arguments[argIdx]); } }
        receiver.methodMissing.apply(receiver, a);
      }
    }
  }

  window.MM = MM;
})();
