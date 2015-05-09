var $ez, $list, $state, $search, $handlers, $match,
    Elem, Tab, List, Match;

$ez = (function () {
  return {
    emptyFallback: function () {},
    toTabIdArray: function (tab) { return tab.id; },
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
    '(': ' ', ')': ' ', '{': ' ', '}': ' ', ' ': ' ', '-': '*', '_': ' ',
    '&': '*', '|': '*', '=': '*', '*': '*', '+': '+', "'": '*', '"': '*',
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

  function fuzzy(str, pattern, s, p, score, bonus, matched, deepness) {
    // End of the pattern, successfull match
    if (p >= pattern.length) {
      return makeMatchObject(score + (s >= str.length), matched, false);
    }

    // End of the string, failed to match all the pattern, apply penalty to score
    if (s >= str.length) {
      return makeMatchObject(score, matched, true);
    }

    var c = str[s];
    var lowerC = c.toLowerCase();
    if (lowerC === pattern[p]) {
      // Look a head to find best possible match
      var altMatch;
      if (deepness > 0) {
        altMatch = fuzzy(str, pattern, s+1, p, score, 0, matched.slice(), deepness - 1);
      }

      // Store current match and calculate bonus
      matched.push(s);

      // Bonus for capitals
      if (c !== lowerC) {
        score += 3;
      }
      score += 1 + bonus;
      bonus += 5;
      var match = fuzzy(str, pattern, s+1, p+1, score, bonus, matched, deepness);
      // Return the best score
      return (!altMatch || altMatch.score <= match.score) ? match : altMatch;
    } else {
      // TODO: If we don't have any bonus, this could be an inverted type
      // try to match previous char with current and current with previous

      // If nothing matched, recalculate bonus
      bonus = (c === '*' || c === ' ') ? 3 : 0;
      return fuzzy(str, pattern, s+1, p, score, bonus, matched, deepness);
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
      var bestMatch = fuzzy(block.normalized, pattern, 0, 0, 0, 8, [], 6);
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
          renderResultToHtml: false,
          normalized: true
        }
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
      _input = document.getElementById("search");

  return {
    isEmpty: function () {
      return !_prevInputValue;
    },
    getPattern: function () {
      return _input.value;
    },
    update: function () {
      var pattern = _input.value
      if (_prevInputValue !== pattern) {
        _prevInputValue = pattern;
        $list.update(pattern);
      }
    },
    valid: function () {
      _input.classList.remove('invalid');
    },
    invalid: function () {
      _input.classList.add('invalid');
    },
    enable: function () {
      _input.classList.remove('disable');
    },
    disable: function () {
      _input.classList.add('disable');
    },
    focus: function () {
      _input.focus();
    },
    onkeydown: function (eventHandler) {
      _input.onkeydown = eventHandler;
    }
  };
})();

Elem = (function (){
  var Elem = (function () {
    var elemId = 0;
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

      this.type = type;
      this.buttonHTML = button;
      this.css = button.classList;
      this.elemId = elemId++;
    };
  })();

  Elem.prototype.activate = (function () {
    var _previousActive = { elemId: null };
    return function () {
      if (this.elemId === _previousActive.elemId) { return; }
      this.css.add('active');
      if (_previousActive.elemId !== null) {
        _previousActive.css.remove('active');
      }
      _previousActive = this;
      return this;
    }
  })();

  Elem.prototype.match = function () { }; // 

  Elem.prototype.compare = function (elem) {
    return this.elemId - elem.elemId;
  };

  Elem.prototype.byScore = function (elem) {
    if (elem.partial && !this.partial) { return -1; }
    if (this.partial && !elem.partial) { return  1; }
    if (elem.score !== this.score) { return elem.score - this.score; }
    return this.compare(elem);
  }

  Elem.prototype.update = function () {
    if ($search.isEmpty()) {
      this.setCssFull();
    }
  };

  Elem.prototype.setPartialMatch = function () {
    this.css.remove('match-full');
    this.css.add('match-partial');
    this.partial = true;
  };

  Elem.prototype.setFullMatch = function () {
    this.css.remove('match-partial');
    this.css.add('match-full');
    this.partial = false;
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
    url = (this.url.match(/(^\S+\/\/)([^\/]+)(.+)/) || ['','', this.url,'/']);
    this.hostname = $match.toBlock(url[2]);
    this.pathname = $match.toBlock(url[3]);
    this.title = $match.toBlock(this.title);

    // Generate Children
    this.h3 = document.createElement('h3');
    this.span = document.createElement('span');
    Elem.call(this, 'tab', [this.h3, this.span]);

    // Populate children content
    this.update();
  }

  Tab.prototype = Object.create(Elem.prototype);

  Tab.prototype.update = function () {
    if ($search.isEmpty()) {
      this.h3.innerHTML = this.title.str;
      this.span.innerHTML = '<i>'+ this.hostname.str
                          +'</i>'+ this.pathname.str;
    } else {
      this.h3.innerHTML = this.title.HTML;
      this.span.innerHTML = '<i>'+ this.hostname.HTML
                          +'</i>'+ this.pathname.HTML;
    }
  };

  Tab.prototype.match = function (pattern) {
    var match = $match[$state.matchType],
        ret = match(this.hostname, pattern)
            + match(this.pathname, pattern)
            + match(this.title, pattern);

    this[(ret) ? 'setFullMatch' : 'setPartialMatch']();
    this.score = this.hostname.score * 2
               + this.pathname.score
               + this.title.score;
  };

  Tab.prototype.setFavIcon = function (newFavIcons) {
    _favIcons = newFavIcons;
  };

  Tab.prototype.generateFavIcon = function () {
    if (this.favIcon) { return; }
    this.favIcon = true;

    var iconData, img, favIcon = document.createElement('div');

    favIcon.className = 'fav-icon';
    iconData = (typeof this.favIconUrl === 'number')
             ? this.url
             : _favIcons[this.favIconUrl].data;

    if (typeof iconData === 'string') {
      img = document.createElement('img');

      img.src = iconData;
      img.onError = handleFavIconLoadfailure.bind(this);
      favIcon.appendChild(img);
    } else {
      favIcon.classList.add('not-found');
    }
    this.favIconDiv = favIcon;
    this.buttonHTML.appendChild(favIcon);
    return this;
  };

  Tab.prototype.updateCurrent = function () {
    if (this.windowId === $state.getWindowId()) {
      this.css.add('current');
    }
    return this;
  };

  Tab.prototype.compare = function (tab) {
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
      chrome.windows.update(this.windowId, { 'focused': true });
    }
    // TODO: May want to call window.close(); after this method...
    return this;
  };

  Tab.prototype.move = function (windowId) {
    chrome.tabs.move(this.id, {
      index: -1,
      windowId: windowId
    }, function () {
      this.unselect();
      this.windowId = $state.getWindowId();
      this.css.add('current');
      $state.setSelectingState(false);
    });
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
  };

  // KeyCode handlers
  Tab.prototype[$state.opts.key.move] = function () {  // key M
    this.move(windowId);
  };

  Tab.prototype[$state.opts.key.close] = function () {  // Key W
    this.close();
  };

  return Tab;
})();

List = (function () {
  var _elemArray = [],
      _list = document.getElementById('list'),
      _active = -1;

  // Scroll to element if necessary
  function scrollTo(elem) {
    var min = _list.scrollTop
    var max = _list.clientHeight + min;
    var offset = elem.offsetTop;
    var height = elem.offsetHeight;

    if ((offset + height - 4) > max) {
      _list.scrollTop += (offset + height - 4) - max;
    } else if (min && (offset - (height * 2) < min)) {
      _list.scrollTop += offset - (height * 2) - min;
    }
  }

  function setActive(idx) {
    _active = Math.min(Math.max(0, idx), _elemArray.length - 1);
    scrollTo(_elemArray[_active].activate());
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

  function forEach(key) {
    var i = -1, len = _elemArray.length, fn;
    while (++i < len) {
      fn = _elemArray[i][key];
      if (typeof fn === 'function') {
        fn();
      }
    }
  }

  function forEachTest(key, test, value) {
    var i = -1, len = _elemArray.length, val, fn;
    while (++i < len) {
      val = _elemArray[i];
      if (val[test] === value) {
        fn = val[key];
        if (typeof fn === 'function') {
          fn();
        }
      }
    }
  }

  var List = function (tabArray) {
    var i = -1, len = tabArray.length;
    _elemArray = Array(len);
    while (++i < len) {
      _elemArray[i] = new Tab(tabArray[i]);
    }
    this.sort();
    i = -1;
    while (++i < len) {
      _list.appendChild(_elemArray[i].buttonHTML);
    }
    chrome.runtime.sendMessage({ type: 'loadFavIcons' }, function (newFavIcons) {
      Tab.prototype.setFavIcon(newFavIcons);
      this.forEachSelected('generateFavIcon');
    }.bind(this));
    setActive(0);
  };

  List.prototype.selectMatched = function () {
    if ($search.isEmpty()) { return; }
    forEachTest('select', 'partial', false);
    return this;
  };

  List.prototype.toggleActiveSelection = function () {
    var activeElem = _elemArray[_active];
    if (!activeElem) { return; }
    if (activeElem.selected) {
      activeElem.unselect();
    } else {
      activeElem.select();
    }
    setSelectingState(!!(getAllSelectedTabs().length));
    return this;
  };

  List.prototype.render = function () {
    var i = -1, len = _elemArray.length, elem, btn, buttons = _list.childNodes;
    while (++i < len) {
      elem = _elemArray[i];
      btn = buttons[i];
      if (elem.elemId !== btn.dataset.id) {
        _list.insertBefore(elem.buttonHTML, btn);
      }
    }
    return this;
  }

  List.prototype.update = function (pattern) {
    if ($search.isEmpty()) {
      $search.valid();
      return this.sort();
    }

    var i = -1, len = _elemArray.length, noMatch = true;

    pattern = $match.normalize(pattern).replace(/-/g, '');
    while (++i < len) {
      var elem = _elemArray[i];
      elem.match(pattern);
      if (!elem.partial) {
        noMatch = false;
      }
    }
    if (noMatch) {
      // set class no match on input
      $search.invalid();
    } else {
      this.sort('byScore');
      $search.valid();
    }
    return this;
  };

  List.prototype.sort = function (sortMethod) {
    sortMethod = (sortMethod || 'compare');
    _elemArray.sort(function (a, b) {
      return a[sortMethod](b);
    })
    return this;
  };

  List.prototype.clear = function () {
    while (_list.hasChildNodes()) {
      _list.removeChild(_list.lastChild);
    }
    return this;
  };

  List.prototype.activate = function (elemId) {
    forEachTest('activate', 'elemId', elemId);
    return this;
  };

  List.prototype.open = function (elemId) {
    forEachTest('open', 'elemId', elemId);
    return this;
  };

  List.prototype.remove = function (elemId) {
    forEachTest('close', 'elemId', elemId);
    return this;
  };

  List.prototype.forEachSelected = function (key) {
    forEachTest(key, 'selected', true);
    return this;
  };

  List.prototype[$state.opts.key.select] = function (e) {
    if (_active === -1) { return; }
    e.preventDefault();
    $list.toggleActiveSelection();
  };

  List.prototype[$state.opts.key.enter] = function (e) {
    _elemArray[_active].open();
  };

  List.prototype[$state.opts.key.cancel] = function (e) {
    if ($state.isSelecting()) {  
      _elemArray.forEach(function (tab) {
        tab.unselect();
      });
      setSelectingState(false);
    }
  };

  List.prototype[$state.opts.key.up] = function (e) {
    setActive(_active - 1);
    e.preventDefault();
  };

  List.prototype[$state.opts.key.down] = function (e) {
    setActive(_active + 1);
    e.preventDefault();
  };

  List.prototype[$state.opts.key.all] = function (e) {
    $list.selectMatched();
    e.preventDefault();
  };

  return List;
})();

var $handlers = (function () {

  // Subscribe to DOM events
  $search.onkeydown(function (event) {
    var fn = $list[event.keyCode];
    if (typeof fn === 'function') {
      fn(event);
    }
    if ($state.isSelecting()) {
      $list.actionOnSelected($ez.getEventKey(event));
      event.preventDefault();
    }
  });

  function checkClickedElement(elem) {
    if (elem.tagName !== "BUTTON") {
      elem = elem.offsetParent;
      if (elem.tagName !== "BUTTON") { return false; }
    }
    return elem;
  }

  document.body.onmousedown = function (e) {
    if (checkClickedElement(e.target) && e.which === 2) {
      return false;
    }
  };

  document.body.onmouseup = function (e) {
    var elem = checkClickedElement(e.target);
    if (!elem) { return; }
    if (e.which === 2) {
      $list.remove(elem.dataset.id);
      e.preventDefault();
    } else if (e.which === 1) {
      $list.open(elem.dataset.id);
    }
  };
});

function setInfo(bgInfo) {
  $state.setWindowId(bgInfo.currentTab.windowId);
  $match = Match($state.opts.match);
  $list = new List(bgInfo.tabs);
  $list.update();
}

// Start it all !
function init() {
  chrome.runtime.onMessage.addListener(function (req, sender) {
    if (req.type === "data") {
      setInfo(req.data);
    }
  });
  chrome.runtime.sendMessage({type: 'loadPopup'});

  // Start the update
  setInterval($search.update, 35);

  // Init handlers
  $handlers();

  $search.focus();
}

init();
