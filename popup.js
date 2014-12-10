// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _asyncLoadState = 0;
var _active = -1;
var _prevTabId = -1;
var _actions = [];
var _prevInputValue = '';
var _isSelecting = false;
var _normalizeMap = {
  'Á': 'A', 'Ă': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'Ǎ': 'A', 'Â': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
  'Ä': 'A', 'Ǟ': 'A', 'Ȧ': 'A', 'Ǡ': 'A', 'Ạ': 'A', 'Ȁ': 'A', 'À': 'A',
  'Ả': 'A', 'Ȃ': 'A', 'Ā': 'A', 'Ą': 'A', 'Å': 'A', 'Ǻ': 'A', 'Ḁ': 'A',
  'Ⱥ': 'A', 'Ã': 'A', 'Ꜳ': 'AA', 'Æ': 'AE', 'Ǽ': 'AE', 'Ǣ': 'AE', 'Ꜵ': 'AO',
  'Ꜷ': 'AU', 'Ꜹ': 'AV', 'Ꜻ': 'AV', 'Ꜽ': 'AY', 'Ḃ': 'B', 'Ḅ': 'B', 'Ɓ': 'B',
  'Ḇ': 'B', 'Ƀ': 'B', 'Ƃ': 'B', 'Ć': 'C', 'Č': 'C', 'Ç': 'C', 'Ḉ': 'C',
  'Ĉ': 'C', 'Ċ': 'C', 'Ƈ': 'C', 'Ȼ': 'C', 'Ď': 'D', 'Ḑ': 'D', 'Ḓ': 'D',
  'Ḋ': 'D', 'Ḍ': 'D', 'Ɗ': 'D', 'Ḏ': 'D', 'ǲ': 'D', 'ǅ': 'D', 'Đ': 'D',
  'Ƌ': 'D', 'Ǳ': 'DZ', 'Ǆ': 'DZ', 'É': 'E', 'Ĕ': 'E', 'Ě': 'E', 'Ȩ': 'E',
  'Ḝ': 'E', 'Ê': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ḙ': 'E', 'Ë': 'E', 'Ė': 'E', 'Ẹ': 'E', 'Ȅ': 'E', 'È': 'E', 'Ẻ': 'E',
  'Ȇ': 'E', 'Ē': 'E', 'Ḗ': 'E', 'Ḕ': 'E', 'Ę': 'E', 'Ɇ': 'E', 'Ẽ': 'E',
  'Ḛ': 'E', 'Ꝫ': 'ET', 'Ḟ': 'F', 'Ƒ': 'F', 'Ǵ': 'G', 'Ğ': 'G', 'Ǧ': 'G',
  'Ģ': 'G', 'Ĝ': 'G', 'Ġ': 'G', 'Ɠ': 'G', 'Ḡ': 'G', 'Ǥ': 'G', 'Ḫ': 'H',
  'Ȟ': 'H', 'Ḩ': 'H', 'Ĥ': 'H', 'Ⱨ': 'H', 'Ḧ': 'H', 'Ḣ': 'H', 'Ḥ': 'H',
  'Ħ': 'H', 'Í': 'I', 'Ĭ': 'I', 'Ǐ': 'I', 'Î': 'I', 'Ï': 'I', 'Ḯ': 'I',
  'İ': 'I', 'Ị': 'I', 'Ȉ': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ȋ': 'I', 'Ī': 'I',
  'Į': 'I', 'Ɨ': 'I', 'Ĩ': 'I', 'Ḭ': 'I', 'Ꝺ': 'D', 'Ꝼ': 'F', 'Ᵹ': 'G',
  'Ꞃ': 'R', 'Ꞅ': 'S', 'Ꞇ': 'T', 'Ꝭ': 'IS', 'Ĵ': 'J', 'Ɉ': 'J', 'Ḱ': 'K',
  'Ǩ': 'K', 'Ķ': 'K', 'Ⱪ': 'K', 'Ꝃ': 'K', 'Ḳ': 'K', 'Ƙ': 'K', 'Ḵ': 'K',
  'Ꝁ': 'K', 'Ꝅ': 'K', 'Ĺ': 'L', 'Ƚ': 'L', 'Ľ': 'L', 'Ļ': 'L', 'Ḽ': 'L',
  'Ḷ': 'L', 'Ḹ': 'L', 'Ⱡ': 'L', 'Ꝉ': 'L', 'Ḻ': 'L', 'Ŀ': 'L', 'Ɫ': 'L',
  'ǈ': 'L', 'Ł': 'L', 'Ǉ': 'LJ', 'Ḿ': 'M', 'Ṁ': 'M', 'Ṃ': 'M', 'Ɱ': 'M',
  'Ń': 'N', 'Ň': 'N', 'Ņ': 'N', 'Ṋ': 'N', 'Ṅ': 'N', 'Ṇ': 'N', 'Ǹ': 'N',
  'Ɲ': 'N', 'Ṉ': 'N', 'Ƞ': 'N', 'ǋ': 'N', 'Ñ': 'N', 'Ǌ': 'NJ', 'Ó': 'O',
  'Ŏ': 'O', 'Ǒ': 'O', 'Ô': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ồ': 'O', 'Ổ': 'O',
  'Ỗ': 'O', 'Ö': 'O', 'Ȫ': 'O', 'Ȯ': 'O', 'Ȱ': 'O', 'Ọ': 'O', 'Ő': 'O',
  'Ȍ': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Ơ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ờ': 'O',
  'Ở': 'O', 'Ỡ': 'O', 'Ȏ': 'O', 'Ꝋ': 'O', 'Ꝍ': 'O', 'Ō': 'O', 'Ṓ': 'O',
  'Ṑ': 'O', 'Ɵ': 'O', 'Ǫ': 'O', 'Ǭ': 'O', 'Ø': 'O', 'Ǿ': 'O', 'Õ': 'O',
  'Ṍ': 'O', 'Ṏ': 'O', 'Ȭ': 'O', 'Ƣ': 'OI', 'Ꝏ': 'OO', 'Ɛ': 'E', 'Ɔ': 'O',
  'Ȣ': 'OU', 'Ṕ': 'P', 'Ṗ': 'P', 'Ꝓ': 'P', 'Ƥ': 'P', 'Ꝕ': 'P', 'Ᵽ': 'P',
  'Ꝑ': 'P', 'Ꝙ': 'Q', 'Ꝗ': 'Q', 'Ŕ': 'R', 'Ř': 'R', 'Ŗ': 'R', 'Ṙ': 'R',
  'Ṛ': 'R', 'Ṝ': 'R', 'Ȑ': 'R', 'Ȓ': 'R', 'Ṟ': 'R', 'Ɍ': 'R', 'Ɽ': 'R',
  'Ꜿ': 'C', 'Ǝ': 'E', 'Ś': 'S', 'Ṥ': 'S', 'Š': 'S', 'Ṧ': 'S', 'Ş': 'S',
  'Ŝ': 'S', 'Ș': 'S', 'Ṡ': 'S', 'Ṣ': 'S', 'Ṩ': 'S', 'Ť': 'T', 'Ţ': 'T',
  'Ṱ': 'T', 'Ț': 'T', 'Ⱦ': 'T', 'Ṫ': 'T', 'Ṭ': 'T', 'Ƭ': 'T', 'Ṯ': 'T',
  'Ʈ': 'T', 'Ŧ': 'T', 'Ɐ': 'A', 'Ꞁ': 'L', 'Ɯ': 'M', 'Ʌ': 'V', 'Ꜩ': 'TZ',
  'Ú': 'U', 'Ŭ': 'U', 'Ǔ': 'U', 'Û': 'U', 'Ṷ': 'U', 'Ü': 'U', 'Ǘ': 'U',
  'Ǚ': 'U', 'Ǜ': 'U', 'Ǖ': 'U', 'Ṳ': 'U', 'Ụ': 'U', 'Ű': 'U', 'Ȕ': 'U',
  'Ù': 'U', 'Ủ': 'U', 'Ư': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ừ': 'U', 'Ử': 'U',
  'Ữ': 'U', 'Ȗ': 'U', 'Ū': 'U', 'Ṻ': 'U', 'Ų': 'U', 'Ů': 'U', 'Ũ': 'U',
  'Ṹ': 'U', 'Ṵ': 'U', 'Ꝟ': 'V', 'Ṿ': 'V', 'Ʋ': 'V', 'Ṽ': 'V', 'Ꝡ': 'VY',
  'Ẃ': 'W', 'Ŵ': 'W', 'Ẅ': 'W', 'Ẇ': 'W', 'Ẉ': 'W', 'Ẁ': 'W', 'Ⱳ': 'W',
  'Ẍ': 'X', 'Ẋ': 'X', 'Ý': 'Y', 'Ŷ': 'Y', 'Ÿ': 'Y', 'Ẏ': 'Y', 'Ỵ': 'Y',
  'Ỳ': 'Y', 'Ƴ': 'Y', 'Ỷ': 'Y', 'Ỿ': 'Y', 'Ȳ': 'Y', 'Ɏ': 'Y', 'Ỹ': 'Y',
  'Ź': 'Z', 'Ž': 'Z', 'Ẑ': 'Z', 'Ⱬ': 'Z', 'Ż': 'Z', 'Ẓ': 'Z', 'Ȥ': 'Z',
  'Ẕ': 'Z', 'Ƶ': 'Z', 'Ĳ': 'IJ', 'Œ': 'OE', 'ᴀ': 'A', 'ᴁ': 'AE', 'ʙ': 'B',
  'ᴃ': 'B', 'ᴄ': 'C', 'ᴅ': 'D', 'ᴇ': 'E', 'ꜰ': 'F', 'ɢ': 'G', 'ʛ': 'G',
  'ʜ': 'H', 'ɪ': 'I', 'ʁ': 'R', 'ᴊ': 'J', 'ᴋ': 'K', 'ʟ': 'L', 'ᴌ': 'L',
  'ᴍ': 'M', 'ɴ': 'N', 'ᴏ': 'O', 'ɶ': 'OE', 'ᴐ': 'O', 'ᴕ': 'OU', 'ᴘ': 'P',
  'ʀ': 'R', 'ᴎ': 'N', 'ᴙ': 'R', 'ꜱ': 'S', 'ᴛ': 'T', 'ⱻ': 'E', 'ᴚ': 'R',
  'ᴜ': 'U', 'ᴠ': 'V', 'ᴡ': 'W', 'ʏ': 'Y', 'ᴢ': 'Z', 'á': 'a', 'ă': 'a',
  'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ǎ': 'a', 'â': 'a',
  'ấ': 'a', 'ậ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ä': 'a', 'ǟ': 'a',
  'ȧ': 'a', 'ǡ': 'a', 'ạ': 'a', 'ȁ': 'a', 'à': 'a', 'ả': 'a', 'ȃ': 'a',
  'ā': 'a', 'ą': 'a', 'ᶏ': 'a', 'ẚ': 'a', 'å': 'a', 'ǻ': 'a', 'ḁ': 'a',
  'ⱥ': 'a', 'ã': 'a', 'ꜳ': 'aa', 'æ': 'ae', 'ǽ': 'ae', 'ǣ': 'ae', 'ꜵ': 'ao',
  'ꜷ': 'au', 'ꜹ': 'av', 'ꜻ': 'av', 'ꜽ': 'ay', 'ḃ': 'b', 'ḅ': 'b', 'ɓ': 'b',
  'ḇ': 'b', 'ᵬ': 'b', 'ᶀ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɵ': 'o', 'ć': 'c',
  'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ĉ': 'c', 'ɕ': 'c', 'ċ': 'c', 'ƈ': 'c',
  'ȼ': 'c', 'ď': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ȡ': 'd', 'ḋ': 'd', 'ḍ': 'd',
  'ɗ': 'd', 'ᶑ': 'd', 'ḏ': 'd', 'ᵭ': 'd', 'ᶁ': 'd', 'đ': 'd', 'ɖ': 'd',
  'ƌ': 'd', 'ı': 'i', 'ȷ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'ǳ': 'dz', 'ǆ': 'dz',
  'é': 'e', 'ĕ': 'e', 'ě': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ê': 'e', 'ế': 'e',
  'ệ': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ḙ': 'e', 'ë': 'e', 'ė': 'e',
  'ẹ': 'e', 'ȅ': 'e', 'è': 'e', 'ẻ': 'e', 'ȇ': 'e', 'ē': 'e', 'ḗ': 'e',
  'ḕ': 'e', 'ⱸ': 'e', 'ę': 'e', 'ᶒ': 'e', 'ɇ': 'e', 'ẽ': 'e', 'ḛ': 'e',
  'ꝫ': 'et', 'ḟ': 'f', 'ƒ': 'f', 'ᵮ': 'f', 'ᶂ': 'f', 'ǵ': 'g', 'ğ': 'g',
  'ǧ': 'g', 'ģ': 'g', 'ĝ': 'g', 'ġ': 'g', 'ɠ': 'g', 'ḡ': 'g', 'ᶃ': 'g',
  'ǥ': 'g', 'ḫ': 'h', 'ȟ': 'h', 'ḩ': 'h', 'ĥ': 'h', 'ⱨ': 'h', 'ḧ': 'h',
  'ḣ': 'h', 'ḥ': 'h', 'ɦ': 'h', 'ẖ': 'h', 'ħ': 'h', 'ƕ': 'hv', 'í': 'i',
  'ĭ': 'i', 'ǐ': 'i', 'î': 'i', 'ï': 'i', 'ḯ': 'i', 'ị': 'i', 'ȉ': 'i',
  'ì': 'i', 'ỉ': 'i', 'ȋ': 'i', 'ī': 'i', 'į': 'i', 'ᶖ': 'i', 'ɨ': 'i',
  'ĩ': 'i', 'ḭ': 'i', 'ꝺ': 'd', 'ꝼ': 'f', 'ᵹ': 'g', 'ꞃ': 'r', 'ꞅ': 's',
  'ꞇ': 't', 'ꝭ': 'is', 'ǰ': 'j', 'ĵ': 'j', 'ʝ': 'j', 'ɉ': 'j', 'ḱ': 'k',
  'ǩ': 'k', 'ķ': 'k', 'ⱪ': 'k', 'ꝃ': 'k', 'ḳ': 'k', 'ƙ': 'k', 'ḵ': 'k',
  'ᶄ': 'k', 'ꝁ': 'k', 'ꝅ': 'k', 'ĺ': 'l', 'ƚ': 'l', 'ɬ': 'l', 'ľ': 'l',
  'ļ': 'l', 'ḽ': 'l', 'ȴ': 'l', 'ḷ': 'l', 'ḹ': 'l', 'ⱡ': 'l', 'ꝉ': 'l',
  'ḻ': 'l', 'ŀ': 'l', 'ɫ': 'l', 'ᶅ': 'l', 'ɭ': 'l', 'ł': 'l', 'ǉ': 'lj',
  'ſ': 's', 'ẜ': 's', 'ẛ': 's', 'ẝ': 's', 'ḿ': 'm', 'ṁ': 'm', 'ṃ': 'm',
  'ɱ': 'm', 'ᵯ': 'm', 'ᶆ': 'm', 'ń': 'n', 'ň': 'n', 'ņ': 'n', 'ṋ': 'n',
  'ȵ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ǹ': 'n', 'ɲ': 'n', 'ṉ': 'n', 'ƞ': 'n',
  'ᵰ': 'n', 'ᶇ': 'n', 'ɳ': 'n', 'ñ': 'n', 'ǌ': 'nj', 'ó': 'o', 'ŏ': 'o',
  'ǒ': 'o', 'ô': 'o', 'ố': 'o', 'ộ': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ö': 'o', 'ȫ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ọ': 'o', 'ő': 'o', 'ȍ': 'o',
  'ò': 'o', 'ỏ': 'o', 'ơ': 'o', 'ớ': 'o', 'ợ': 'o', 'ờ': 'o', 'ở': 'o',
  'ỡ': 'o', 'ȏ': 'o', 'ꝋ': 'o', 'ꝍ': 'o', 'ⱺ': 'o', 'ō': 'o', 'ṓ': 'o',
  'ṑ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'õ': 'o', 'ṍ': 'o',
  'ṏ': 'o', 'ȭ': 'o', 'ƣ': 'oi', 'ꝏ': 'oo', 'ɛ': 'e', 'ᶓ': 'e', 'ɔ': 'o',
  'ᶗ': 'o', 'ȣ': 'ou', 'ṕ': 'p', 'ṗ': 'p', 'ꝓ': 'p', 'ƥ': 'p', 'ᵱ': 'p',
  'ᶈ': 'p', 'ꝕ': 'p', 'ᵽ': 'p', 'ꝑ': 'p', 'ꝙ': 'q', 'ʠ': 'q', 'ɋ': 'q',
  'ꝗ': 'q', 'ŕ': 'r', 'ř': 'r', 'ŗ': 'r', 'ṙ': 'r', 'ṛ': 'r', 'ṝ': 'r',
  'ȑ': 'r', 'ɾ': 'r', 'ᵳ': 'r', 'ȓ': 'r', 'ṟ': 'r', 'ɼ': 'r', 'ᵲ': 'r',
  'ᶉ': 'r', 'ɍ': 'r', 'ɽ': 'r', 'ↄ': 'c', 'ꜿ': 'c', 'ɘ': 'e', 'ɿ': 'r',
  'ś': 's', 'ṥ': 's', 'š': 's', 'ṧ': 's', 'ş': 's', 'ŝ': 's', 'ș': 's',
  'ṡ': 's', 'ṣ': 's', 'ṩ': 's', 'ʂ': 's', 'ᵴ': 's', 'ᶊ': 's', 'ȿ': 's',
  'ɡ': 'g', 'ᴑ': 'o', 'ᴓ': 'o', 'ᴝ': 'u', 'ť': 't', 'ţ': 't', 'ṱ': 't',
  'ț': 't', 'ȶ': 't', 'ẗ': 't', 'ⱦ': 't', 'ṫ': 't', 'ṭ': 't', 'ƭ': 't',
  'ṯ': 't', 'ᵵ': 't', 'ƫ': 't', 'ʈ': 't', 'ŧ': 't', 'ᵺ': 'th', 'ɐ': 'a',
  'ᴂ': 'ae', 'ǝ': 'e', 'ᵷ': 'g', 'ɥ': 'h', 'ʮ': 'h', 'ʯ': 'h', 'ᴉ': 'i',
  'ʞ': 'k', 'ꞁ': 'l', 'ɯ': 'm', 'ɰ': 'm', 'ᴔ': 'oe', 'ɹ': 'r', 'ɻ': 'r',
  'ɺ': 'r', 'ⱹ': 'r', 'ʇ': 't', 'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y', 'ꜩ': 'tz',
  'ú': 'u', 'ŭ': 'u', 'ǔ': 'u', 'û': 'u', 'ṷ': 'u', 'ü': 'u', 'ǘ': 'u',
  'ǚ': 'u', 'ǜ': 'u', 'ǖ': 'u', 'ṳ': 'u', 'ụ': 'u', 'ű': 'u', 'ȕ': 'u',
  'ù': 'u', 'ủ': 'u', 'ư': 'u', 'ứ': 'u', 'ự': 'u', 'ừ': 'u', 'ử': 'u',
  'ữ': 'u', 'ȗ': 'u', 'ū': 'u', 'ṻ': 'u', 'ų': 'u', 'ᶙ': 'u', 'ů': 'u',
  'ũ': 'u', 'ṹ': 'u', 'ṵ': 'u', 'ᵫ': 'ue', 'ꝸ': 'um', 'ⱴ': 'v', 'ꝟ': 'v',
  'ṿ': 'v', 'ʋ': 'v', 'ᶌ': 'v', 'ⱱ': 'v', 'ṽ': 'v', 'ꝡ': 'vy', 'ẃ': 'w',
  'ŵ': 'w', 'ẅ': 'w', 'ẇ': 'w', 'ẉ': 'w', 'ẁ': 'w', 'ⱳ': 'w', 'ẘ': 'w',
  'ẍ': 'x', 'ẋ': 'x', 'ᶍ': 'x', 'ý': 'y', 'ŷ': 'y', 'ÿ': 'y', 'ẏ': 'y',
  'ỵ': 'y', 'ỳ': 'y', 'ƴ': 'y', 'ỷ': 'y', 'ỿ': 'y', 'ȳ': 'y', 'ẙ': 'y',
  'ɏ': 'y', 'ỹ': 'y', 'ź': 'z', 'ž': 'z', 'ẑ': 'z', 'ʑ': 'z', 'ⱬ': 'z',
  'ż': 'z', 'ẓ': 'z', 'ȥ': 'z', 'ẕ': 'z', 'ᵶ': 'z', 'ᶎ': 'z', 'ʐ': 'z',
  'ƶ': 'z', 'ɀ': 'z', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬁ': 'fi', 'ﬂ': 'fl',
  'ĳ': 'ij', 'œ': 'oe', 'ﬆ': 'st', 'ₐ': 'a', 'ₑ': 'e', 'ᵢ': 'i', 'ⱼ': 'j',
  'ₒ': 'o', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x', '.': '-', ',': '-',
  ':': '-', ';': '-', '[': '-', ']': '-', '(': '-', ')': '-', '{': '-',
  '}': '-', ' ': '-', '-': '-', '_': '-', '&': '-', '|': '-', '=': '-',
  '*': '-', '+': '-', "'": '-', '"': '-', '\\': '-', '/': '-', '<': '-',
  '>': '-'
};

// info on currentTab
var _currentTab = null;
var _opts = {
  // Hide private navigation tabs form the results
  hideIncognito: true
};

// Activate focus on popup opening
_elem.search.focus();

// First Async loads callbacks
function tryLoadTabs() {
  if (_asyncLoadState === 1) {
    chrome.tabs.query({}, loadTabs);
    _asyncLoadState = 0;
  } else {
    _asyncLoadState++;
  }
}

function setCurrent(tabs) {
  _currentTab = tabs[0];
  tryLoadTabs();
}

function setPrevious(tabId) {
  _prevTabId = tabId;
  tryLoadTabs();
}

function loadTabs(tabs) {
  _tabs = tabs.filter(initialTabsFilter);
  _tabs.forEach(genTab);
  showTabs(initialTabsSort);
}

// Generate tabs
function showTabs(sortCallback) {
  cleanTabList();
  _tabs.sort(sortCallback);
  appendAllTabs(_tabs, sortCallback);
}

// filters, sort and map callbacks
function initialTabsFilter(tab) {
  if ((tab.id === _currentTab.id) || (typeof tab.id === 'undefined')) {
    return false;
  }
  return !(_opts.hideIncognito && tab.incognito);
}

function onlySelectedTabsFilter(tab) {
  return tab.isUserSelected;
}

function toTabIdArray(tab) {
  return tab.id;
}

function filterAndDestroySelected(tab) {
  if (tab.isUserSelected) {
    _elem.list.removeChild(tab.buttonHTML);
    return false;
  }
  return true;
}

function initialTabsSort(a, b) {
  if (a.id === _prevTabId) { return -1; }
  if (b.id === _prevTabId) { return 1; }
  if (a.windowId !== b.windowId) {
    if (a.windowId === _currentTab.windowId) {
      return -1;
    }
    if (b.windowId === _currentTab.windowId) {
      return 1;
    }
    return b.windowId - a.windowId;
  }
  return a.index - b.index;
}

function scoreTabsSort(a, b) {
  return b.score - a.score;
}

// Dom Stuff
function isMatched() {
  return !!_prevInputValue;
}

function makeUrl(tab) {
  if (isMatched()) {
    return '<i>' + tab.hostnameHTML + tab.suffix + '</i>' + tab.pathnameHTML;
  } else {
    return '<i>' + tab.hostname + tab.suffix + '</i>' + tab.pathname;
  }
}

function setDomAttrs(button, idx, title, url, tab) {
  button.id = 'tab-' + idx;
  button.dataset.index = idx;
  button.className = '';
  title.innerHTML = isMatched() ? tab.titleHTML : tab.title;
  url.innerHTML = makeUrl(tab);
}

function handleFaviconLoadfailure(event) {
  var t = event.target;
  t.offsetParent.className += ' not-found';
  t.remove()
}

function createButtonHTML(tab, idx) {
  var title = document.createElement('h3');
  var url = document.createElement('span');

  var favIcon = document.createElement('div');
  favIcon.className = 'fav-icon';
  if (tab.windowId === _currentTab.windowId) {
    favIcon.className += ' current';
  }
  if (tab.favIconUrl) {
    var img = document.createElement('img');
    img.src = tab.favIconUrl;
    img.addEventListener("error", handleFaviconLoadfailure);
    favIcon.appendChild(img);
  } else {
    favIcon.className += ' not-found';
  }

  var button = document.createElement('button');
  button.dataset.id = tab.id;
  button.appendChild(favIcon);
  button.appendChild(title);
  button.appendChild(url);
  return button;
}

// here I separate domain from url param to fine controle the score later
function genTab(tab, idx) {
  var url = new URL(tab.url);
  if (!/^http/.test(url.protocol)) {
    tab.hostname = (url.protocol === 'chrome:')
                  ? url.origin
                  : url.href.substring(0, 75);
    tab.suffix = '';
    tab.pathname = '';
  } else {
    tab.hostname = url.hostname.replace(/(^www\.|\..[^\.]+$)/g, '');
    tab.suffix = url.hostname.match(/\..[^\.]+$/);
    tab.pathname = (url.pathname + url.hash).replace(/\/$/, '');
    tab.pathname = tab.pathname.substring(0, 75 - tab.hostname.length);
  }
  tab.buttonHTML = createButtonHTML(tab, idx);
  tab.hostnameNormalized = normalize(tab.hostname);
  tab.titleNormalized = normalize(tab.title);
  tab.pathnameNormalized = normalize(tab.pathname);
}

function appendAllTabs() {
  var l = _elem.list;
  for (var i = 0; i < _tabs.length; i++) {
    var button = _tabs[i].buttonHTML;
    var c = button.children;
    setDomAttrs(button, i, c[1], c[2], _tabs[i]);
    l.appendChild(button);
  }
  setActive(0);
}

function cleanTabList() {
  var l = _elem.list;
  while (l.hasChildNodes()) {
    l.removeChild(l.lastChild);
  }
}

// Start it all !
function init() {
  var queryOptions = {
    'currentWindow': true,
    'active': true
  };
  chrome.tabs.query(queryOptions, setCurrent);

  // get previous tab from tabHistory
  chrome.runtime.sendMessage({}, setPrevious);

  // Start the update
  setInterval(update, 100);
}

// Fuzzy Search
// ToDo :
// tolerate repeating letters (ex: tollerate)
// tolerate inverted letters (ex: toelrate)
// tolerate typos (ex: tolerarte)

// TODO: try with objects instead of array for matchedIdx collection
function normalize(str) {
  var normalized_str = '';
  var c;

  for (var i = 0; i < str.length; i++) {
    c = str[i];
    if (/[0-9A-Za-z]/i.test(c)) {
      normalized_str += c;
    } else {
      normalized_str += (_normalizeMap[str[i]] || '-');
    }
  }
  return (normalized_str);
}

function makeObject(score, matched, partial) {
  return {
    'score': score,
    'matched': matched,
    'partial': partial
  };
}

function fuzzyMatch(str, pattern, s, p, score, bonus, matched) {
  // End of the pattern, successfull match
  if (p >= pattern.length) {
    return makeObject(score, matched, false);
  }

  // End of the string, failed to match all the pattern, apply penalty to score
  if (s >= str.length) {
    return makeObject(~~(score / 3), matched, true);
  }

  var c = str[s];
  var lowerC = c.toLowerCase();
  if (lowerC === pattern[p]) {
    // Look a head to find best possible match
    var altMatch = fuzzyMatch(str, pattern, s+1, p, score, 0, matched.slice());

    // Store current match and calculate bonus
    matched.push(s);

    // Bonus for capitals
    if (c !== lowerC) {
      score += 2;
    }
    score += 1 + bonus;
    bonus += 5;
    var match = fuzzyMatch(str, pattern, s+1, p+1, score, bonus, matched);

    // Return the best score
    return match.score < altMatch.score ? altMatch : match;
  } else {
    // TODO: If we don't have any bonus, this could be an inverted type
    // try to match previous char with current and current with previous

    // If nothing matched, recalculate bonus
    bonus = c === '-' ? 3 : 0;
    return fuzzyMatch(str, pattern, s+1, p, score, bonus, matched);
  }
}

function applyArrayToHTML(arr, baseStr) {
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

function fuzzyMatchString(tab, key, pattern) {
  var str = tab[key + 'Normalized'];
  var bestMatch = fuzzyMatch(str, pattern, 0, 0, 0, 5, []);
  tab.score += bestMatch.score;
  tab[key + 'HTML'] = applyArrayToHTML(bestMatch.matched, tab[key]);
  return bestMatch.partial ? 1 : 0;
}

function refreshInputMatching(pattern) {
  if (typeof pattern !== 'string' || !pattern.length) {
    return showTabs(initialTabsSort);
  }
  pattern = normalize(pattern.toLowerCase()).replace(/-/, '');
  var ret = 0;
  for (var i = _tabs.length - 1; i >= 0; i--) {
    var tab = _tabs[i];
    tab.score = 0;
    ret += fuzzyMatchString(tab, 'hostname', pattern);
    tab.score *= 2; // match in host should bd worth more
    ret += fuzzyMatchString(tab, 'title', pattern);
    ret += fuzzyMatchString(tab, 'pathname', pattern);
    tab.titleHTML = tab.titleHTML;
  }
  if (ret) {
    showTabs(scoreTabsSort);
  }
}

// Scroll to element if necessary
function scrollTo(elem) {
  var l = _elem.list;
  var min = l.scrollTop
  var max = l.clientHeight + min;
  var offset = elem.offsetTop;
  var height = elem.offsetHeight;

  if ((offset + height - 4) > max) {
    l.scrollTop += (offset + height - 4) - max;
  } else if (min && (offset - (height * 2) < min)) {
    l.scrollTop += offset - (height * 2) - min;
  }
}

// Choose active element
function setActive(idx) {
  idx = Math.min(Math.max(0, idx), _tabs.length - 1);

  var lastTab = _tabs[_active];
  if (lastTab !== undefined) {
    lastTab.buttonHTML.className = '';
  }

  var btn = _tabs[idx].buttonHTML;
  btn.className = 'active';
  _active = idx;

  scrollTo(btn);
}

// Chrome Tabs Actions
function openActiveTab() {
  var activeTab = _tabs[_active];
  if (activeTab.windowId !== _currentTab.windowId) {
    chrome.windows.update(activeTab.windowId, { 'focused': true });
    window.close();
  }
  chrome.tabs.update(activeTab.id, { 'active': true });
}

function closeTabs(tabs, cb) {
  chrome.tabs.remove(tabs.map(toTabIdArray), cb);
};

// Handle Select Actions
function getAllSelectedTabs() {
  return _tabs.filter(onlySelectedTabsFilter);
}

function closeSelectedTabs() {
  var selectedTabs = getAllSelectedTabs();

  closeTabs(selectedTabs, function () {
    _tabs = _tabs.filter(filterAndDestroySelected);
    refreshInputMatching(_prevInputValue);
  });
}

function moveSelectedTabs() {
  // Move tabs to a new or existing window
}

function unselectTab(tab) {
  tab.isUserSelected = false;
}

function unselectAllTabs() {
  _tabs.forEach(unselectTab);
  _isSelecting = false;
}

function toggleSelectActiveTab() {
  var activeTab = _tabs[_active];
  if (!activeTab) { return; }
  var favIcon = activeTab.buttonHTML.firstChild;
  if (activeTab.isUserSelected) {
    activeTab.isUserSelected = false;
    favIcon.className = favIcon.className.replace(/( |)selected/, '');
  } else {
    activeTab.isUserSelected = true;
    favIcon.className += ' selected';
  }
  _isSelecting = !!(getAllSelectedTabs().length);
}

// Update routine
function update() {
  var input = _elem.search;
  if (_prevInputValue !== input.value) {
    _prevInputValue = input.value;
    refreshInputMatching(_prevInputValue);
  }
}

// Handle inputs
_actions[9]  = function (e) { // Key Tab
  if (_active === -1) { return; }
  e.preventDefault();
  toggleSelectActiveTab();
};
_actions[13] = openActiveTab; // Key Enter
_actions[27] = function (e) { // Key esc
  if (_isSelecting) {
    e.preventDefault();
    unselectAllTabs();
  }
};
_actions[87] = function (e) { // Key W
  if (_isSelecting) {
    e.preventDefault();
    closeSelectedTabs();
  }
};
_actions[40] = function () {  // key Down
  setActive(_active + 1);
};
_actions[38] = function () {  // key Up
  setActive(_active - 1);
};

_elem.search.onkeydown = function (e) {
  var fn = _actions[e.keyCode];
  if (typeof fn !== 'function') { return; }
  fn(e);
}

document.body.onclick = function (e) {
  var elem = e.target;
  if (elem.tagName !== "BUTTON") {
    elem = elem.offsetParent;
    if (elem.tagName !== "BUTTON") { return; }
  }
  var idx = elem.dataset.index;
  setActive(idx);
  openActiveTab();
}

init();
