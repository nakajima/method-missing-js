// method-missing-js
(function($) {
  // Find this.method() calls
  function parseDot(string) {
    var match = string.match(/this\.(\w+)/g) || [];
    var i = match.length;
    var results = [];
    while(i-- > 0) { results.push(match[i].split('.')[1]); }
    console.info('dot: ' + results.join(', '));
    return results.reverse();
  }

  // Find this['method']() calls
  function parseBracket(string) {
    var clean = string.split("['").join('["').split("']").join('"]');
    var match = clean.match(/this\[\"(\w+)\"\]/g) || [];
    var i = match.length;
    var results = [];
    while(i-- > 0) { results.push(match[i].match(/this\[\"(\w+)\"\]/)[1]); }
    console.info('bracket: ' + results.join(', '));
    return results.reverse();
  }

  function MM(receiver, fn, replaced, recalled) {
    replaced = replaced || [];
    
    try { fn.call(receiver); }
    catch(e) {

      // If methodMissing not defined, just re-throw error.
      if (!receiver.methodMissing) { throw(e); }

      var missed;
      var cleaned = fn.toString();

      function replaceKey(key) {
        // Find the missing key...
        if (replaced.indexOf(key) > -1) {
          return;
        }

        missed = key;

        // Add it to list of keys replaced so far...
        replaced.unshift(missed);
        
        console.info(missed);
        
        // Define key to use method missing.
        receiver[missed] = function() {
          if (replaced[0] == missed) {
            var a = [missed];
            if (i = arguments.length) { while(i--) { a.push(arguments[i]); } }
            receiver.methodMissing.apply(receiver, a);
          }
        }
      }

      var keys = parseDot(cleaned);
      var i = keys.length;
      while(i--) { replaceKey(keys[i]) }

      console.info(replaced);

      var keys = parseBracket(cleaned);
      var i = keys.length;
      while(i--) { replaceKey(keys[i]) }
      
      console.info(replaced);

      if (!missed) { throw(e); }

      // Try again.
      MM(receiver, fn, replaced)
    }

    // Clear replaced keys
    var i = replaced.length;
    while(i--) { delete(receiver[replaced[i]]); }
  }

  window.MM = MM;
})(jQuery);
