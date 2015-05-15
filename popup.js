var $ez, $list, $state, $search, $match, $commandList,
    Elem, Tab, Setting, Pagelink, Command, List, Match;

var _stored = {}, _indent = '', _prevEndl, __debug__ = true;
function stackLog(msg) {
  if (!__debug__) { return; }
  var name = arguments.callee.caller.name,
      now = window.performance.now();
  if (!_stored[name]) {
    _stored[name] = {
      now: now,
      count: 0,
    };
    if (msg) {
      console.log(_indent +'%c'+ name, 'color: #bada55', msg);     
    } else {
      console.log(_indent +'%c'+ name, 'color: #bada55');
    }
    _indent += '| ';
  } else {
    _indent = _indent.slice(0, -2);
    console.log(_indent +'└> '+ (now - _stored[name].now).toFixed(3) +'ms');
    _stored[name] = null;
  }
}

$ez = (function () {
  var _tabId
  var setBadge = (function () {
    var _prevCount = -1
    return function (count) {
      if (_prevCount === count || _tabId === undefined || typeof count !== "number") { return; }
      _prevCount = count;
      chrome.browserAction.setBadgeText({
        text: (count > 99) ? "99+" : count.toString(),
      });
    };
  })();


  return {
    throttle: function (_fn, _retryTime, _this) {
      var _running = false, _waiting = false;

      function throttledFn() {
        if (_running && !_waiting) {
          setTimeout(throttledFn, _retryTime);
          _waiting = true;
        } else {
          _running = true;
          _fn.call(_this);
          _running = false;
          _waiting = false;
        }
      }

      return throttledFn;
    },
    getTabId: function () {
      return _tabId;
    },
    setTabId: function (tabId) {
      _tabId = tabId;
    },
    getTimeSinceInit: (function () {
      var _initTime = Date.now();
      return function () {
        return Date.now() - _initTime;
      };
    })(),
    emptyFallback: function () {},
    toTabIdArray: function (tab) { return tab.id; },
    setBadge: setBadge,
    clearBadge: function () {
      chrome.browserAction.setBadgeText({ text: ''});
    },
    capitalize: function (str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    },
    getEventKey: function (event) {
      var eventKey = event.keyCode;
      if (event.metaKey) {
        eventKey += '-meta';
      } else if (event.altKey) {
        eventKey += '-alt';
      } else if (event.shiftKey) {
        eventKey += '-shift';
      } else if (event.ctrlKey) {
        eventKey += '-ctrl';
      }
      return eventKey;
    }
  };
})();

Match = (function (opts) {
  var normalizeMap = {
    'á': 'a', 'ă': 'a', 'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'ǎ': 'a', 'â': 'a', 'ấ': 'a', 'ậ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ä': 'a', 'ǟ': 'a', 'ȧ': 'a', 'ǡ': 'a', 'ạ': 'a', 'ȁ': 'a', 'à': 'a',
    'ả': 'a', 'ȃ': 'a', 'ā': 'a', 'ą': 'a', 'ᶏ': 'a', 'ẚ': 'a', 'å': 'a',
    'ǻ': 'a', 'ḁ': 'a', 'ⱥ': 'a', 'ã': 'a', 'ḃ': 'b', 'ḅ': 'b', 'ɓ': 'b',
    'ḇ': 'b', 'ᵬ': 'b', 'ᶀ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɵ': 'o', 'ć': 'c',
    'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ĉ': 'c', 'ɕ': 'c', 'ċ': 'c', 'ƈ': 'c',
    'ȼ': 'c', 'ď': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ȡ': 'd', 'ḋ': 'd', 'ḍ': 'd',
    'ɗ': 'd', 'ᶑ': 'd', 'ḏ': 'd', 'ᵭ': 'd', 'ᶁ': 'd', 'đ': 'd', 'ɖ': 'd',
    'ƌ': 'd', 'ı': 'i', 'ȷ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'é': 'e', 'ĕ': 'e',
    'ě': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ê': 'e', 'ế': 'e', 'ệ': 'e', 'ề': 'e',
    'ể': 'e', 'ễ': 'e', 'ḙ': 'e', 'ë': 'e', 'ė': 'e', 'ẹ': 'e', 'ȅ': 'e',
    'è': 'e', 'ẻ': 'e', 'ȇ': 'e', 'ē': 'e', 'ḗ': 'e', 'ḕ': 'e', 'ⱸ': 'e',
    'ę': 'e', 'ᶒ': 'e', 'ɇ': 'e', 'ẽ': 'e', 'ḛ': 'e', 'ḟ': 'f', 'ƒ': 'f',
    'ᵮ': 'f', 'ᶂ': 'f', 'ǵ': 'g', 'ğ': 'g', 'ǧ': 'g', 'ģ': 'g', 'ĝ': 'g',
    'ġ': 'g', 'ɠ': 'g', 'ḡ': 'g', 'ᶃ': 'g', 'ǥ': 'g', 'ḫ': 'h', 'ȟ': 'h',
    'ḩ': 'h', 'ĥ': 'h', 'ⱨ': 'h', 'ḧ': 'h', 'ḣ': 'h', 'ḥ': 'h', 'ɦ': 'h',
    'ẖ': 'h', 'ħ': 'h', 'í': 'i', 'ĭ': 'i', 'ǐ': 'i', 'î': 'i', 'ï': 'i',
    'ḯ': 'i', 'ị': 'i', 'ȉ': 'i', 'ì': 'i', 'ỉ': 'i', 'ȋ': 'i', 'ī': 'i',
    'į': 'i', 'ᶖ': 'i', 'ɨ': 'i', 'ĩ': 'i', 'ḭ': 'i', 'ꝺ': 'd', 'ꝼ': 'f',
    'ᵹ': 'g', 'ꞃ': 'r', 'ꞅ': 's', 'ꞇ': 't', 'ǰ': 'j', 'ĵ': 'j', 'ʝ': 'j',
    'ɉ': 'j', 'ḱ': 'k', 'ǩ': 'k', 'ķ': 'k', 'ⱪ': 'k', 'ꝃ': 'k', 'ḳ': 'k',
    'ƙ': 'k', 'ḵ': 'k', 'ᶄ': 'k', 'ꝁ': 'k', 'ꝅ': 'k', 'ĺ': 'l', 'ƚ': 'l',
    'ɬ': 'l', 'ľ': 'l', 'ļ': 'l', 'ḽ': 'l', 'ȴ': 'l', 'ḷ': 'l', 'ḹ': 'l',
    'ⱡ': 'l', 'ꝉ': 'l', 'ḻ': 'l', 'ŀ': 'l', 'ɫ': 'l', 'ᶅ': 'l', 'ɭ': 'l',
    'ł': 'l', 'ſ': 's', 'ẜ': 's', 'ẛ': 's', 'ẝ': 's', 'ḿ': 'm', 'ṁ': 'm',
    'ṃ': 'm', 'ɱ': 'm', 'ᵯ': 'm', 'ᶆ': 'm', 'ń': 'n', 'ň': 'n', 'ņ': 'n',
    'ṋ': 'n', 'ȵ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ǹ': 'n', 'ɲ': 'n', 'ṉ': 'n',
    'ƞ': 'n', 'ᵰ': 'n', 'ᶇ': 'n', 'ɳ': 'n', 'ñ': 'n', 'ó': 'o', 'ŏ': 'o',
    'ǒ': 'o', 'ô': 'o', 'ố': 'o', 'ộ': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ö': 'o', 'ȫ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ọ': 'o', 'ő': 'o', 'ȍ': 'o',
    'ò': 'o', 'ỏ': 'o', 'ơ': 'o', 'ớ': 'o', 'ợ': 'o', 'ờ': 'o', 'ở': 'o',
    'ỡ': 'o', 'ȏ': 'o', 'ꝋ': 'o', 'ꝍ': 'o', 'ⱺ': 'o', 'ō': 'o', 'ṓ': 'o',
    'ṑ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'õ': 'o', 'ṍ': 'o',
    'ṏ': 'o', 'ȭ': 'o', 'ɛ': 'e', 'ᶓ': 'e', 'ɔ': 'o', 'ᶗ': 'o', 'ṕ': 'p',
    'ṗ': 'p', 'ꝓ': 'p', 'ƥ': 'p', 'ᵱ': 'p', 'ᶈ': 'p', 'ꝕ': 'p', 'ᵽ': 'p',
    'ꝑ': 'p', 'ꝙ': 'q', 'ʠ': 'q', 'ɋ': 'q', 'ꝗ': 'q', 'ŕ': 'r', 'ř': 'r',
    'ŗ': 'r', 'ṙ': 'r', 'ṛ': 'r', 'ṝ': 'r', 'ȑ': 'r', 'ɾ': 'r', 'ᵳ': 'r',
    'ȓ': 'r', 'ṟ': 'r', 'ɼ': 'r', 'ᵲ': 'r', 'ᶉ': 'r', 'ɍ': 'r', 'ɽ': 'r',
    'ↄ': 'c', 'ꜿ': 'c', 'ɘ': 'e', 'ɿ': 'r', 'ś': 's', 'ṥ': 's', 'š': 's',
    'ṧ': 's', 'ş': 's', 'ŝ': 's', 'ș': 's', 'ṡ': 's', 'ṣ': 's', 'ṩ': 's',
    'ʂ': 's', 'ᵴ': 's', 'ᶊ': 's', 'ȿ': 's', 'ɡ': 'g', 'ᴑ': 'o', 'ᴓ': 'o',
    'ᴝ': 'u', 'ť': 't', 'ţ': 't', 'ṱ': 't', 'ț': 't', 'ȶ': 't', 'ẗ': 't',
    'ⱦ': 't', 'ṫ': 't', 'ṭ': 't', 'ƭ': 't', 'ṯ': 't', 'ᵵ': 't', 'ƫ': 't',
    'ʈ': 't', 'ŧ': 't', 'ɐ': 'a', 'ǝ': 'e', 'ᵷ': 'g', 'ɥ': 'h', 'ʮ': 'h',
    'ʯ': 'h', 'ᴉ': 'i', 'ʞ': 'k', 'ꞁ': 'l', 'ɯ': 'm', 'ɰ': 'm', 'ɹ': 'r',
    'ɻ': 'r', 'ɺ': 'r', 'ⱹ': 'r', 'ʇ': 't', 'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y',
    'ú': 'u', 'ŭ': 'u', 'ǔ': 'u', 'û': 'u', 'ṷ': 'u', 'ü': 'u', 'ǘ': 'u',
    'ǚ': 'u', 'ǜ': 'u', 'ǖ': 'u', 'ṳ': 'u', 'ụ': 'u', 'ű': 'u', 'ȕ': 'u',
    'ù': 'u', 'ủ': 'u', 'ư': 'u', 'ứ': 'u', 'ự': 'u', 'ừ': 'u', 'ử': 'u',
    'ữ': 'u', 'ȗ': 'u', 'ū': 'u', 'ṻ': 'u', 'ų': 'u', 'ᶙ': 'u', 'ů': 'u',
    'ũ': 'u', 'ṹ': 'u', 'ṵ': 'u', 'ⱴ': 'v', 'ꝟ': 'v', 'ṿ': 'v', 'ʋ': 'v',
    'ᶌ': 'v', 'ⱱ': 'v', 'ṽ': 'v', 'ẃ': 'w', 'ŵ': 'w', 'ẅ': 'w', 'ẇ': 'w',
    'ẉ': 'w', 'ẁ': 'w', 'ⱳ': 'w', 'ẘ': 'w', 'ẍ': 'x', 'ẋ': 'x', 'ᶍ': 'x',
    'ý': 'y', 'ŷ': 'y', 'ÿ': 'y', 'ẏ': 'y', 'ỵ': 'y', 'ỳ': 'y', 'ƴ': 'y',
    'ỷ': 'y', 'ỿ': 'y', 'ȳ': 'y', 'ẙ': 'y', 'ɏ': 'y', 'ỹ': 'y', 'ź': 'z',
    'ž': 'z', 'ẑ': 'z', 'ʑ': 'z', 'ⱬ': 'z', 'ż': 'z', 'ẓ': 'z', 'ȥ': 'z',
    'ẕ': 'z', 'ᵶ': 'z', 'ᶎ': 'z', 'ʐ': 'z', 'ƶ': 'z', 'ɀ': 'z', 'ₐ': 'a',
    'ₑ': 'e', 'ᵢ': 'i', 'ⱼ': 'j', 'ₒ': 'o', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v',
    'ₓ': 'x', '.': '*', ',': ' ', ':': ' ', ';': ' ', '[': ' ', ']': ' ',
    '(': ' ', ')': ' ', '{': ' ', '}': ' ', ' ': ' ', '-': '-', '_': ' ',
    '&': '&', '|': '*', '=': '=', '*': '*', '+': '+', "'": "'", '"': '*',
    '/': '*', '<': '*', '>': '*', '#': '#', '\\': '*'
  };

  function normalize(str) {
    if (!opts.normalized) { return str; }
    if (!str) { return ''; }
    var normalized_str = '';
    var c, i;

    for (i = 0; i < str.length; i++) {
      c = str[i];
      if (/[0-9A-Za-z]/i.test(c)) {
        normalized_str += c;
      } else {
        normalized_str += (normalizeMap[str[i]] || '*');
      }
    }
    return opts.caseInsensitive ? normalized_str.toLowerCase() : normalized_str;
  }

  function renderIndexArray(arr, baseStr) {
    if (!opts.renderResultToHtml) { return arr; }
    if (!Array.isArray(arr) || !arr.length) { return baseStr; }
    var strHTML = '';
    var prevIdx = null;
    var openTag = false;
    for (var i = 0; i < baseStr.length; i++) {
      var idx = arr[arr.indexOf(i)];
      if (typeof idx === 'number') {
        if (idx - 1 !== prevIdx) {
          strHTML += '<b>';
          openTag = true;
        }
        prevIdx = idx;
      } else if ((prevIdx !== null) && openTag) {
        strHTML += '</b>';
        openTag = false;
      }
      strHTML += baseStr[i];
    }
    if (openTag) {
      strHTML += '</b>';
    }
    return strHTML;
  }

  function makeMatchObject(score, matched, partial) {
    return {
      'score': score,
      'matched': matched,
      'partial': partial
    };
  }

  function fuzzy(str, pattern, s, p, score, bonus, matched, last) {
    // End of the pattern, successfull match
    if (p >= pattern.length) {
      return makeMatchObject(score + (s >= str.length), matched, false);
    }

    // End of the string, failed to match all the pattern, apply penalty to score
    var len = str.length;
    if (s >= len) {
      return makeMatchObject(score, matched, true);
    }

    var c = str[s];
    var lowerC = c.toLowerCase();
    if (lowerC === pattern[p]) {
      // Look a head to find best possible match
      var altMatch = fuzzy(str, pattern, s+1, p, score, 0, matched.slice(), last);

      // Store current match and calculate bonus
      matched.push(s);

      // Bonus for capitals
      // if (s <= 0) {
        // score += ((len - s - last) / len) * (c === lowerC ? 1 : 4) + bonus;
      // } else {
        score += (c === lowerC ? 1 : 4) + bonus;
      // }
      bonus += 5;
      var match = fuzzy(str, pattern, s+1, p+1, score, bonus, matched, s);
      // Return the best score
      return (altMatch.score <= match.score) ? match : altMatch;
    } else {
      // TODO: If we don't have any bonus, this could be an inverted type
      // try to match previous char with current and current with previous

      // If nothing matched, recalculate bonus
      bonus = (c === '*' || c === ' ') ? 3 : 0;
      return fuzzy(str, pattern, s+1, p, score, bonus, matched, last);
    }
  }

  // adapted from https://github.com/hiddentao/fast-levenshtein
  function levenshtein(str, pattern) {
    var l1 = str.length;
    var l2 = pattern.length;

    // base cases
    if (!l1 || !l2) { return 0 };
    if (Math.abs(l1 - l2) > 3) { return 0; }
    if (str === pattern) { return 1 };

    // two rows
    var curCol, nextCol, i, j, tmp;
    var prevRow = new Array(l2 + 1);

    // initialise previous row
    for (i = 0; i <= l2; i++) {
      prevRow[i] = i;
    }

    // calculate current row distance from previous row
    for (i = 0; i < l1; i++) {
      nextCol = i + 1;

      for (j = 0; j < l2; j++) {
        curCol = nextCol;

        // substution
        nextCol = prevRow[j] + (str[i] !== pattern[j]);
        // insertion
        tmp = curCol + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }
        // deletion
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }

        // copy current col value into previous (in preparation for next iteration)
        prevRow[j] = curCol;
      }

      if (nextCol > 3) { return 0; }
      // copy last col value into previous (in preparation for next iteration)
      prevRow[j] = nextCol;
    }

    // get relative value from tested word length
    nextCol /= l2;
    return (nextCol <  1) ? 0 : 1 - nextCol;
  }

  function renderMatch(str, score, length, end) {
    str = str.slice(end - length, end);
    if (score < 0.5) { return str; }
    if (score > 0.95) { return '<span class="match-high">'+ str +'</span>'; }
    if (score > 0.75) { return '<span class="match-low">'+ str +'</span>'; }
    return '<span class="match-low">'+ str +'</span>';
  }

  function matchWholeWord(block, pattern, algo) {
    var c, i, score;
    var txt = block.normalized;
    var word = '';
    var maxScore = 0;
    var matches = [];
    block.result = '';

    for (i = 0; i < txt.length; i++) {
      c = txt[i];
      if (c === ' ' && word.length) {
        score = algo(word, pattern);
        block.result += renderMatch(block.str, score, word.length, i);
        block.result += block.str[i];
        word = '';
        if (score > maxScore) {
          maxScore = score;
        }
      } else {
        word += c;
      }
    }

    if (word.length) {
      score = algo(word, pattern);
      block.result += renderMatch(block.str, score, word.length, i);
      if (score > maxScore) {
        maxScore = score;
      }
    }
    return maxScore;
  }

  function exact(block, pattern) {
    return +(block === pattern);
  }

  return {
    normalize: normalize,
    exact: function (block, pattern) {
      return matchWholeWord(block, pattern, exact);
    },

    levenshtein: function (block, pattern) {
      return matchWholeWord(block, pattern, levenshtein);
    },

    fuzzy: function (block, pattern) {
      var bestMatch = fuzzy(block.normalized, pattern.replace(/\s/g, ""), 0, 0, 0, 8, [], 6, -1);
      block.score = bestMatch.score; // += ?
      block.result = renderIndexArray(bestMatch.matched, block.str);
      return bestMatch.partial ? 0 : 1;
    },

    toBlock: function (str) {
      return {
        str: str,
        normalized: normalize(str),
        score: 0,
        result: str
      }
    }
  }
});


// State shared globals
$state = (function () {
  var _isSelecting = false,
      _currentWindowId = 0,
      _opts = {
        // TODO: load and store opts
        // Hide private navigation tabs form the results
        hideIncognito: true,
        key: {
          move: 77,
          close: 87,
          select: 9,    // Default : Tab
          enter: 13,    // Default : Enter
          cancel: 27,   // Default : esc
          up: 38,       // Default : Up
          down: 40,     // Default : Down
          all: 65,      // Default : A
        },
        match: {
          caseInsensitive: false,
          renderResultToHtml: true,
          normalized: true
        },
        alwaysShowBadge: false,
      };

  return {
    opts: _opts,
    matchType: 'fuzzy',
    isSelecting: function () {
      return _isSelecting;
    },
    getWindowId: function () {
      return _currentWindowId;
    },
    setWindowId: function (windowId) {
      _currentWindowId = windowId;
    },
    setSelectingState: function (selectState) {
      if (selectState !== _isSelecting) {
        $search[selectState ? 'disable' : 'enable']();
        _isSelecting = selectState;
      }
    }
  };
})();

$search = (function () {
  var _prevInputValue = '',
      _list,
      _input = document.getElementById("search");

  function update() {
    var pattern = _input.value;
    if (_prevInputValue !== pattern) {
      _prevInputValue = pattern;
      _list.update(pattern);
    }
    return Search;
  }

  function preUpdate() {
    if (_prevInputValue !== _input.value) {
      _canRestore = false;
      _input.placeholder = '';
      _prevInputValue = _input.value;
      _list.update(_input.value);
      Search.update = update;
    }
    return Search;
  }

  var Search = {
    isEmpty: function () { return !_prevInputValue; },
    hasNoText: function () {
      if (!_prevInputValue) {
        return true;
      }
      if (_prevInputValue.length === 1) {
        if (_prevInputValue[0] === '/') {
          return true;
        }
      }
      return false;
    },
    getPattern: function () {
      return _input.value;
    },
    update: preUpdate,
    valid: function () {
      _input.classList.remove('invalid');
      return Search;
    },
    invalid: function () {
      _input.classList.add('invalid');
      return Search;
    },
    enable: function () {
      _input.classList.remove('disabled');
      return Search;
    },
    disable: function () {
      _input.classList.add('disabled');
      return Search;
    },
    clear: function () {
      _input.value = '';
    },
    focus: function () {
      _input.focus();
      return Search;
    },
    restorePrevious: function () {
      return Search;
    },
    select: function () {
      _input.select();
      return Search;
    },
    init: function (list, lastPattern) {
      var keyState = {};
      var canRestore = true;
      var whiteList = [
        $state.opts.key.move,
        $state.opts.key.select,
        $state.opts.key.up,
        $state.opts.key.down
      ];

      if (!(list instanceof List)) {
        console.error('list argument isn\'t a List instance');
        return null;
      }
      _list = list;
      _input.onpaste = function () {
        setTimeout(Search.update);
      };
      _input.onkeyup = function (event) {
        keyState[event.keyCode] = false;
      };
      _input.onkeydown = function (event) {
        var keyCode = event.keyCode;
        if (keyState[keyCode]
          && (keyCode < 33 && keyCode > 40)
          && whiteList.indexOf(keyCode) === -1) {
          event.preventDefault();
          return;
        }
        keyState[keyCode] = true;
        console.log('onkeydown', keyCode);
        if (_list[keyCode] instanceof Function) {
          _list[keyCode](event);
        } else if ($state.isSelecting()) {
          _list.forEachSelected($ez.getEventKey(event));
          event.preventDefault();
        }
        if (canRestore && keyCode === 39) {
          _input.value = _input.placeholder;
          _input.placeholder = '';
          setTimeout(_input.select.bind(_input));
          canRestore = false;
        }
        setTimeout(Search.update);
      };
      _input.placeholder = lastPattern;
      return Search;
    }
  };
  return Search;
})();

Elem = (function (){
  function warnHidden(key, elem) {
    console.warn('Tryed method', key, 'on elem-'+ elem.type +'-'+ elem.elemId);
    return elem;
  }
  var Elem = (function () {
    var elemId = 0;

    function onmousedown(event) {
      return (event.which !== 2);
    };

    function onmouseup(event) {
      if (event.which === 3) {
        this.rightClick(event);
      } else if (event.which === 2) {
        this.middleClick(event);
      } else if (event.which === 1) {
        this.leftClick(event);
      }
    };

    return function (type, children) {
      var i = -1,
          len = children.length,
          button = document.createElement('button');

      button.id = 'elem-'+ elemId;
      button.dataset = {
        type: type,
        id: elemId
      };

      while (++i < len) {
        button.appendChild(children[i]);
      }

      button.onmousedown = onmousedown.bind(this);
      button.onmouseup = onmouseup.bind(this);

      this.type = type;
      this.buttonHTML = button;
      this.css = button.classList;
      this.elemId = elemId++;
      this.score = 0;
      this.partial = false;
      this.hidden = false;
    };
  })();

  Elem.prototype.activate = (function () {
    var _previousActive = { elemId: null };
    return function () {
      if (this.elemId === _previousActive.elemId) { return this; }
      this.css.add('active');
      if (_previousActive.elemId !== null) {
        _previousActive.css.remove('active');
      }
      _previousActive = this;
      return this;
    }
  })();

  // Should be implemented by specific Elems
  Elem.prototype.match = 
  Elem.prototype.leftClick = 
  Elem.prototype.middleClick = 
  Elem.prototype.rightClick = function () { return this; };

  Elem.prototype.compare = function (elem) {
    return this.elemId - elem.elemId;
  };

  Elem.prototype.byScore = function (elem) {
    if (elem.partial && !this.partial) { return -1; }
    if (this.partial && !elem.partial) { return  1; }
    if (elem.score !== this.score) { return elem.score - this.score; }
    return this.compare(elem);
  }

  Elem.prototype.show = function (type) {
    if (this.type === type) {
      this.css.remove('hide');
      this.hidden = false;
    } else {
      this.css.add('hide');
      this.hidden = true;
    }
    return this;
  };

  Elem.prototype.update = function () {
    if ($search.hasNoText()) {
      this.clearPatrialMatch();
    }
    return this;
  };

  Elem.prototype.applyPartialMatch = function () {
    if (this.partial) { return this; }
    this.css.add('match-partial');
    this.partial = true;
    return this;
  };

  Elem.prototype.clearPatrialMatch = function () {
    if (!this.partial) { return this; }
    this.css.remove('match-partial');
    this.partial = false;
    return this;
  };

  Elem.prototype.select = function () {
    this.selected = true;
    this.css.add('selected');
    return this;
  };

  Elem.prototype.unselect = function () {
    this.selected = false;
    this.css.remove('selected');
    return this;
  };

  return Elem;
})();

Command = (function () {
  function Command(commandData) {
    var span = document.createElement('span');
    this.h3 = document.createElement('h3');
    this.h3.textContent = commandData.key;
    span.textContent = commandData.description;
    this.key = $match.toBlock($ez.capitalize(commandData.key));
    Elem.call(this, 'command', [this.h3, span]);
  }

  Command.prototype = Object.create(Elem.prototype);

  Command.prototype.compare = function (elem) {
    if (this.type !== elem.type) { return 0; }
    return this.key.str - elem.key.str;
  };

  Command.prototype.update = function (pattern) {
    if ($search.hasNoText()) {
      this.h3.innerHTML = '<i>/</i>'+ this.key.str;
    } else {
      this.h3.innerHTML = '<i>/</i>'+ this.key.result;
    }
  };

  Command.prototype.match = function (pattern) {
    this.score = this[$match[$state.matchType](this.key, pattern)
      ? 'clearPatrialMatch'
      : 'applyPartialMatch'
    ]().key.score;
    return this;
  };

  return Command;
})();

$chromePageLink = (function () {
  return [
    "accessibility",
    "appcache-internals",
    "apps",
    "blob-internals",
    "bookmarks",
    "cache",
    "components",
    "conflicts",
    "copresence",
    "crashes",
    "device-log",
    "devices",
    "dns",
    "downloads",
    "extensions",
    "flags",
    "flash",
    "gcm-internals",
    "gpu",
    "help",
    "histograms",
    "history",
    "indexeddb-internals",
    "inspect",
    "invalidations",
    "local-state",
    "media-internals",
    "memory-internals",
    "memory-redirect",
    "nacl",
    "net-internals",
    "newtab",
    "omnibox",
    "password-manager-internals",
    "plugins",
    "policy",
    "predictors",
    "print",
    "profiler",
    "quota-internals",
    "settings",
    "serviceworker-internals",
    "signin-internals",
    "sync-internals",
    "suggestions",
    "system",
    "terms",
    "thumbnails",
    "tracing",
    "translate-internals",
    "user-actions",
    "view-http-cache",
    "version",
    "voicesearch",
    "webrtc-internals",
    "webrtc-logs",
  ].map(function (key) {
    return "chrome://"+ key +"/";
  });
  // chrome://favicon/size/16@1x/
  // chrome.history.search({text:'', endTime: Date.now() - 86400000 }, function (res) { console.log(res); });
});

$commandList = [
  {
    key: "history",
    favIconUrl: "chrome://favicon/size/16@1x/chrome://history",
    description: "Open tab from recent history",
    action: function () {
      console.log('history');
    },
  }, {
    key: "chrome",
    favIconUrl: "chrome://favicon/size/16@1x/",
    description: 'List all "chrome://" links',
    init: function () { },
    action: function () {
      console.log('chrome');
    },
  }, {
    key: "settings",
    favIconUrl: "chrome://favicon/size/16@1x/chrome://settings",
    description: "Configure this panel settings and change shortcuts",
    action: function () {
      console.log('settings');
    },
  }, {
    key: "bookmarks",
    favIconUrl: "chrome://favicon/size/16@1x/",
    description: "Open tab from your bookmarks",
    action: function () {
      console.log('bookmarks');
    },
  },
];



Pagelink = (function () {
  function Pagelink() {

    Elem.call(this, 'pagelink', []);
  }

  Pagelink.prototype = Object.create(Elem.prototype);

  return Pagelink;
})();

Setting = (function () {
  function Setting(name) {

    var h3 = document.createElement('h3');
    h3.textContent = name;
    Elem.call(this, 'setting', [h3]);
  }

  Setting.prototype = Object.create(Elem.prototype);

  return Setting;
})();

Tab = (function () {
  var _favIcons = {},
      _wantedKeys = [
      'windowId',
      'openInfo',
      'url',
      'title',
      'favIconUrl',
      'id'
    ];

  function handleFavIconLoadfailure(event) {
    this.css.add('not-found');
    this.favIconUrl = '';
    event.target.remove();
  }

  var Tab = function (tab) {
    var url;
    // init default values
    this.selected = false;

    // copy values of given tab
    _wantedKeys.forEach(function (key) {
      this[key] = tab[key];
    }.bind(this));

    // Prepare URL and Title
    url = new URL(this.url);
    this.hostname = $match.toBlock(url.hostname);
    this.pathname = $match.toBlock(url.pathname);
    this.urlFragments = '<s>'+ url.search + url.hash +'</s>';
    this.title = $match.toBlock(this.title);

    // Generate Children
    this.h3 = document.createElement('h3');
    this.span = document.createElement('span');
    Elem.call(this, 'tab', [this.h3, this.span]);

    // Populate children content
    this.update();

    if (this.windowId === $state.getWindowId()) {
      this.css.add('current');
    }
  }

  Tab.prototype = Object.create(Elem.prototype);

  Tab.prototype.leftClick = function (event) {
    this.open();
  };

  Tab.prototype.middleClick = function (event) {
    this.close();
    event.preventDefault();
  };

  Tab.prototype.update = function () {
    if ($search.isEmpty()) {
      this.h3.innerHTML = this.title.str;
      this.span.innerHTML = '<i>'+ this.hostname.str
                          +'</i>'+ this.pathname.str
                          + this.urlFragments;
      this.clearPatrialMatch();
    } else {
      this.h3.innerHTML = this.title.result;
      this.span.innerHTML = '<i>'+ this.hostname.result
                          +'</i>'+ this.pathname.result
                          + this.urlFragments;
    }
    return this;
  };

  Tab.prototype.match = function (pattern) {
    var match = $match[$state.matchType],
        ret = match(this.hostname, pattern)
            + match(this.pathname, pattern)
            + match(this.title, pattern);

    this[(ret) ? 'clearPatrialMatch' : 'applyPartialMatch']();
    this.score = this.hostname.score
               + this.pathname.score
               + this.title.score * 2;
    return this;
  };

  Tab.prototype.setFavIcon = function (newFavIcons) {
    _favIcons = newFavIcons;
    return this;
  };

  Tab.prototype.generateFavIcon = function () {
    if (this.favIcon) { return; }
    this.favIcon = true;

    var iconData, img, favIcon = document.createElement('div');
    favIcon.className = 'fav-icon';
    iconData = (typeof this.favIconUrl === 'number')
             ? this.url
             : _favIcons[this.favIconUrl].data;

    if (typeof iconData === 'string' && iconData[0] !== '#') {
      img = document.createElement('img');
      img.src = iconData;
      img.onError = handleFavIconLoadfailure.bind(this);
      favIcon.appendChild(img);
    } else {
      this.css.add('not-found');
    }
    this.favIconDiv = favIcon;
    this.buttonHTML.appendChild(favIcon);
    return this;
  };

  Tab.prototype.compare = function (tab) {
    if (this.type !== tab.type) { return 0; }
    if (this.openInfo.time || tab.openInfo.time) {
      if (this.openInfo.fresh) {
        if (tab.openInfo.fresh) { return this.openInfo.time - tab.openInfo.time; }
        return -1;
      } else if (tab.openInfo.fresh) { return 1; }
      return tab.openInfo.time - this.openInfo.time;
    }
    if (this.windowId !== tab.windowId) {
      if (this.windowId === $state.getWindowId()) { return -1; }
      if (tab.windowId === $state.getWindowId()) { return 1; }
      return tab.windowId - this.windowId;
    }
    return Elem.prototype.compare.call(this, tab);
  };

  // Chrome API methods
  Tab.prototype.open = function () {
    chrome.tabs.update(this.id, { 'active': true });
    if (this.windowId !== $state.getWindowId()) {
      chrome.windows.update(this.windowId, { 'focused': true }, function () {
        window.close();
      });
    }
    return this;
  };

  Tab.prototype.move = function (windowId) {
    console.log('move', this, 'to', windowId);
    chrome.tabs.move(this.id, {
      index: -1,
      windowId: windowId
    }, function () {
      this.unselect();
      this.windowId = windowId;
      if (windowId === $state.getWindowId()) {
        this.css.add('current');
      }
      $state.setSelectingState(false);
    }.bind(this));
    return this;
  };

  /*
   * call back exemple:
   * remove from _elemArray
   * _list.removeChild(tab.buttonHTML);
   */
  Tab.prototype.close = function (callback) {
    chrome.tabs.remove(this.id, (callback || $ez.emptyFallback));
    this.buttonHTML.remove();
    this.buttonHTML = null;
  };

  // KeyCode handlers, return true to refresh the list
  Tab.prototype[$state.opts.key.move] = function () {  // key M
    this.move($state.getWindowId());
  };

  Tab.prototype[$state.opts.key.close] = function () {  // Key W
    this.close();
  };

  return Tab;
})();

List = (function () {
  var _elemArray = [],
      _list = document.getElementById('list'),
      _selectedType = 'none',
      _active = -1;

  // Scroll to element if necessary
  // for some reason this function is very very expensive
  // so I prevent from calling it until 2 sec passed.
  function scrollTo(elem) {
    if ($ez.getTimeSinceInit() < 2000) { return; }
    scrollTo = function (elem) {
      var min = _list.scrollTop
      var max = _list.clientHeight + min;
      var offset = elem.offsetTop;
      var height = elem.offsetHeight;

      if ((offset + height - 4) > max) {
        _list.scrollTop += (offset + height - 4) - max;
      } else if (min && (offset - (height * 2) < min)) {
        _list.scrollTop += offset - (height * 2) - min;
      }
    };
    scrollTo(elem);
  }

  function activeNext() {
    var len = _elemArray.length, i = _active;
    while (i++ < len) {
      if (!_elemArray[i].hidden) {
        _active = i;
        scrollTo(_elemArray[i].activate().buttonHTML);
        return;
      }
    }
  }

  function activePrevious() {
    var i = _active;
    while (--i >= 0) {
      if (!_elemArray[i].hidden) {
        _active = i;
        scrollTo(_elemArray[i].activate().buttonHTML);
        return;
      }
    }
  }

  function activeFirst(noScroll) {
    var len = _elemArray.length;
    _active = -1;
    while (_active < len) {
      _active++;
      if (!_elemArray[_active].hidden) {
        var elem = _elemArray[_active].activate();
        if (scroll !== false) {
          scrollTo(elem.buttonHTML);
        }
        return;
      }
    }
  }

  function getIndex(value) {
    var i = -1, len = _elemArray.length;
    while (++i < len) {
      if (_elemArray[i] === value) {
        return _elemArray[i];
      }
    }
    return null;
  }

  function eachVisible(key) {
    var i = -1, len = _elemArray.length, elem;
    while (++i < len) {
      elem = _elemArray[i];
      if (!elem.hidden && elem[key] instanceof Function) {
        elem[key]();
      }
    }
  }

  function eachTest(key, test, value) {
    var i = -1, len = _elemArray.length, elem;
    while (++i < len) {
      elem = _elemArray[i];
      if (elem[test] === value && elem[key] instanceof Function) {
        elem[key]();
      }
    }
  }

  function eachVisibleTest(key, test, value) {
    var i = -1, len = _elemArray.length, elem;
    while (++i < len) {
      elem = _elemArray[i];
      if (!elem.hidden
          && elem[test] === value
          && elem[key] instanceof Function) {
        elem[key]();
      }
    }
  }

  function keyExtendedAction(key) {
    switch (key) {
      case 'close':
      case $state.opts.key.close:
        _elemArray = _elemArray.filter(removeDeleted);
        this.render('byScore');
      break;
      default: break;
    }
  }

  var List = function (contentArray) {
    var i = -1, len = contentArray.length, elem;

    this.update = $ez.throttle(update, 5, this);
    _elemArray = Array(len);
    while (++i < len) {
      elem = contentArray[i];
      _elemArray[i] = new elem.type(elem.data);
    }
    this.show('tab').sort('compare');
    i = -1;
    while (++i < len) {
      _list.appendChild(_elemArray[i].buttonHTML);
    }
    chrome.runtime.sendMessage({
      type: 'loadFavIcons'
    }, function (newFavIcons) {
      Tab.prototype.setFavIcon(newFavIcons);
      eachTest('generateFavIcon', 'type', 'tab');
    });
    activeFirst(false);
  };

  function removeDeleted(elem) {
    return (elem.buttonHTML !== null);
  }

  List.prototype.selectMatched = function selectMatched() {
    stackLog();
    if ($search.hasNoText()) {
      eachVisible('select');
    } else {
      eachVisibleTest('select', 'partial', false);
    }
    stackLog();
    return this.updateBadge();
  };

  List.prototype.updateBadge = function updateBadge() {
    stackLog();
    if ($state.isSelecting()) {
      $ez.setBadge(this.count('selected', true));
    } else {
      $ez.setBadge(this.count('partial', false));
    }
    stackLog();
    return this;
  }

  List.prototype.hasSelectedElement = function hasSelectedElement() {
    stackLog();
    var i = -1; len = _elemArray.length;
    while (++i < len) {
      if (_elemArray[i].selected) {
        stackLog();
        return true;
      }
    }
    stackLog();
    return false;
  };

  List.prototype.count = function (key, value) {
    var i = -1; len = _elemArray.length, total = 0;
    while (++i < len) {
      if (!_elemArray[i].hidden && _elemArray[i][key] === value) {
        total++;
      }
    }
    return total;
  };

  List.prototype.show = function show(type) {
    if (!type || type === _selectedType) { return this; }
    stackLog();
    _selectedType = type;
    var i = -1; len = _elemArray.length;
    while (++i < len) {
      _elemArray[i].show(_selectedType);
    }
    stackLog();
    return this;
  };

  List.prototype.toggleActiveSelection = function toggleActiveSelection() {
    stackLog();
    var activeElem = _elemArray[_active];
    if (activeElem.selected) {
      activeElem.unselect();
    } else {
      activeElem.select();
    }
    $state.setSelectingState(this.hasSelectedElement());
    this.updateBadge();
    stackLog();
    return this;
  };

  // call to apply sorted array to the dom
  List.prototype.render = function render(sortMethod) {
    stackLog();
    this.sort(sortMethod);
    eachVisible('update');
    this.updateBadge();
    var i = -1,
        len = _elemArray.length,
        elem,
        btn,
        cleanupArray = [],
        buttons = _list.childNodes;
    while (++i < len) {
      elem = _elemArray[i];
      btn = buttons[i];
      if (elem.elemId !== btn.dataset.id) {
        _list.insertBefore(elem.buttonHTML, btn);
      }
    }
    activeFirst();
    stackLog();
    return this;
  }

  // added on list initialisation
  function update(pattern) {
    console.timeEnd('list update');
    console.time('list update');
    stackLog();
    if ($search.isEmpty()) {
      $search.valid();
      stackLog();
      return this.show('tab').render();
    }
    pattern = $search.getPattern();
    if (pattern[0] === '/') {
      this.show('command');
      if (pattern.length === 1) {
        stackLog();
        return this.render();
      }
      pattern = pattern.slice(1);
    } else {
      this.show('tab');
    }

    var i = -1, len = _elemArray.length, noMatch = true;

    pattern = $match.normalize(pattern).replace(/\s/g, '');
    while (++i < len) {
      var elem = _elemArray[i];
      if (elem.hidden) { continue; }
      elem.match(pattern).update();
      if (!elem.partial) {
        noMatch = false;
      }
    }
    if (noMatch) {
      // set class no match on input
      $search.invalid();
    } else {
      this.render('byScore');
      $search.valid();
    }
    stackLog();
    return this;
  };

  List.prototype.sort = function sort(sortMethod) {
    stackLog();
    sortMethod = (sortMethod || 'compare');
    _elemArray.sort(function (a, b) {
      return a[sortMethod](b);
    })
    stackLog();
    return this;
  };

  List.prototype.clear = function clear() {
    stackLog();
    while (_list.hasChildNodes()) {
      _list.removeChild(_list.lastChild);
    }
    stackLog();
    return this;
  };

  List.prototype.activate = function activate(elemId) {
    stackLog();
    eachVisibleTest('activate', 'elemId', elemId);
    stackLog();
    return this;
  };

  List.prototype.open = function open(elemId) {
    eachVisibleTest('open', 'elemId', elemId);
    return this;
  };

  List.prototype.forEachSelected = function forEachSelected(key) {
    eachVisibleTest(key, 'selected', true);
    keyExtendedAction.call(this, key);
    return this;
  };

  List.prototype[$state.opts.key.select] = function (event) {
    if (_active === -1) { return; }
    event.preventDefault();
    this.toggleActiveSelection();
  };

  List.prototype[$state.opts.key.enter] = function (event) {
    _elemArray[_active].open();
  };

  List.prototype[$state.opts.key.cancel] = function (event) {
    if (_selectedType === 'command') {
      $search.clear();
      this.render();
      event.preventDefault();
    } else if ($state.isSelecting()) {  
      eachVisible('unselect');
      $state.setSelectingState(false);
      this.updateBadge();
      event.preventDefault();
    }
  };

  List.prototype[$state.opts.key.up] = function (event) {
    activePrevious();
    event.preventDefault();
  };

  List.prototype[$state.opts.key.down] = function (event) {
    activeNext();
    event.preventDefault();
  };

  List.prototype[$state.opts.key.all] = function (event) {
    if ($state.isSelecting()) {
      this.selectMatched();
      event.preventDefault();
    }
  };

  return List;
})();

function toType(Type, elemArray) {
  return elemArray.map(function (elem) {
    return { type: Type, data: elem };
  });
}

function setInfo(bgInfo) {
  $state.setWindowId(bgInfo.currentTab.windowId);
  $ez.setTabId(bgInfo.currentTab.id);
  $match = Match($state.opts.match);
  $list = new List(toType(Tab, bgInfo.tabs).concat(toType(Command, $commandList)));
  $search.init($list, bgInfo.lastPattern);
  setTimeout(function() {
    $search.select();
    $list.update();
  });
}

// Start it all !
function init() {
  var _isOpen = false;
  chrome.runtime.onMessage.addListener(function (req, sender) {
    if (req.type === "data") {
      setInfo(req.data);
      if (_isOpen) {
        window.close();
      }
      _isOpen = true;
    }
  });

  chrome.runtime.sendMessage({type: 'loadPopup'});

  addEventListener("unload", function (event) {
    var bgPage = chrome.extension.getBackgroundPage();
    if ($state.opts.alwaysShowBadge) {
      bgPage.setBadgeCount(List.prototype.count('type', 'tab'));
      stackLog();
    } else {
      bgPage.clearBadge();
    }
    bgPage.setLastPattern($search.getPattern());
  }, true);
}

init();
