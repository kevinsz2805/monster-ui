/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 /**
 * jQuery Extended Cookie Plugin
 *
 * Author: Frederick Giasson
 * 
 * Copyright (c) 2012 Structured Dynamics LLC 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie = function (key, value, options) {
  // Check if localStorage of HTML5 exists in this browser
  var isStorageAvailable = false;
  if ("localStorage" in window)
  {
    try {
      window.localStorage.setItem("isStorageAvailable", "true");
      isStorageAvailable = true;
      window.localStorage.removeItem("isStorageAvailable", "true");
    } catch (PrivateBrowsingError) {
      // iOS Private Browsing mode will throw a "QUOTA_EXCEEDED_ERRROR DOM Exception 22" error
    }
  }
  
  // Check if the user wants to create or delete a cookie.
  if (arguments.length > 1 && String(value) !== "[object Object]") {
    options = jQuery.extend({}, options);

    // Set the default value of the maxChunkSize option if it is not yet defined.
    if(options.maxChunkSize == undefined) {
      options.maxChunkSize = 3000;
    }
    
    // Set the default value of the maxNumberOfCookies option if it is not yet defined.
    if(options.maxNumberOfCookies == undefined) {
      options.maxNumberOfCookies = 20;
    }
    
    // Set the usage of the local storage to true by default
    if(options.useLocalStorage == undefined) {
      options.useLocalStorage = true;
    }

    // Check if the user tries to delete the cookie
    if(value === null || value === undefined) {
      // If the localStorage is available, and if the user requested its usage, then we first
      // try to delete it from that place
      if(options.useLocalStorage && isStorageAvailable != false) {
        localStorage.removeItem(key);
      }
      
      // Even if the localStora was used, we try to remove some possible old cookies
      // Delete all possible chunks for that cookie
      for(var i = 0; i < options.maxNumberOfCookies; i++) {
        var keyToDelete;
        if(i == 0) {
          // The first chunk doesn't have the chunk indicator "---"
          keyToDelete = key;
          var exists = $.chunkedcookie(key);
        } else {
          keyToDelete = key + "---" + i;
          var exists = $.chunkedcookie(key + "---" + i);
        }

        if(exists != null) {
          $.chunkedcookie(key + "---" + i, null, options);
        } else {
          break;
        }
      }
    } else {
      // If the localStorage is available, and if the user requested its usage, 
      // then we create that value in the localStorage of the browser (and not in a cookie)
      if(options.useLocalStorage && isStorageAvailable != false) {
        localStorage.setItem(key, value);
      } else {
        // The user tries to create a new cookie
        
        // Chunk the input content
        var exp = new RegExp(".{1,"+options.maxChunkSize+"}","g");

        if(value.match != undefined) {
          var chunks = value.match(exp);

          // Create one cookie per chunk
          for(var i = 0; i < chunks.length; i++) {
            if(i == 0) {
              $.chunkedcookie(key, chunks[i], options);
            } else {
              $.chunkedcookie(key + "---" + i, chunks[i], options);
            }
          }
        } else {
          // The value is probably a number, so we add it to a single cookie
          $.chunkedcookie(key, value, options); 
        }
      }
    }

    return(null);
  }

  // Check if options have been given for a cookie retreival operation  
  if(options == undefined) 
  {
    var options;
    
    if(arguments.length > 1 && String(value) === "[object Object]")
    {
      options = value;
    }
    else
    {
      options = {};
    }
    
    if(options.maxNumberOfCookies == undefined)
    {
      options.maxNumberOfCookies = 20;
    }    
    
    if(options.useLocalStorage == undefined)
    {
      options.useLocalStorage = true;
    }    
  }

  // If localStorage is available, we first check if there exists a value for that name.
  // If no value exists in the localStorage, then we continue by checking in the cookies
  // This second checkup is needed in case that a cookie has been created in the past, 
  // using the old cookie jQuery plugin.
  if(isStorageAvailable != false)
  {
    var value = localStorage.getItem(key);
    
    if(value != undefined && value != null)
    {
      return(value); 
    }    
  }

  var value = "";
  
  // The user tries to get the value of a cookie
  for(var i = 0; i < options.maxNumberOfCookies; i++)
  {
    // Check if the next chunk exists in the browser
    if(i == 0)
    {
      var val = $.chunkedcookie(key);  
    }
    else
    {
      var val = $.chunkedcookie(key + "---" + i);
    }
    
    // Append the value
    if(val != null)
    {
      value += val;
    }
    else
    {
      // If the value is null, and we are looking at the first chunk, then
      // it means that the cookie simply doesn't exist
      if(i == 0)
      {
        return(null);
      }
      
      break;
    }
  } 
  
  // Return the entire content from all the cookies that may have been used for that value.
  return(value);  
};

/**
 * The chunkedcookie function comes from the jQuery Cookie plugin available here:
 * 
 *   https://github.com/carhartl/jquery-cookie
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.chunkedcookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/* Old version of cookie, had to change because doesn't support longer cookies, as we need them with SSO Office for example
Just leaving this commented for now to make sure we don't need to backport it later

jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
*/

/*
 * jQuery MD5 Plugin 1.2.1
 * https://github.com/blueimp/jQuery-MD5
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, jQuery */
(function($){function safe_add(x,y){var lsw=(x&65535)+(y&65535),msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535);}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}function binl_md5(x,len){x[len>>5]|=128<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var i,olda,oldb,oldc,oldd,a=1732584193,b=-271733879,c=-1732584194,d=271733878;for(i=0;i<x.length;i+=16){olda=a;oldb=b;oldc=c;oldd=d;a=md5_ff(a,b,c,d,x[i],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}return[a,b,c,d];}function binl2rstr(input){var i,output="";for(i=0;i<input.length*32;i+=8){output+=String.fromCharCode((input[i>>5]>>>(i%32))&255);}return output;}function rstr2binl(input){var i,output=[];output[(input.length>>2)-1]=undefined;for(i=0;i<output.length;i+=1){output[i]=0;}for(i=0;i<input.length*8;i+=8){output[i>>5]|=(input.charCodeAt(i/8)&255)<<(i%32);}return output;}function rstr_md5(s){return binl2rstr(binl_md5(rstr2binl(s),s.length*8));}function rstr_hmac_md5(key,data){var i,bkey=rstr2binl(key),ipad=[],opad=[],hash;ipad[15]=opad[15]=undefined;if(bkey.length>16){bkey=binl_md5(bkey,key.length*8);}for(i=0;i<16;i+=1){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828;}hash=binl_md5(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binl_md5(opad.concat(hash),512+128));}function rstr2hex(input){var hex_tab="0123456789abcdef",output="",x,i;for(i=0;i<input.length;i+=1){x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&15)+hex_tab.charAt(x&15);}return output;}function str2rstr_utf8(input){return unescape(encodeURIComponent(input));}function raw_md5(s){return rstr_md5(str2rstr_utf8(s));}function hex_md5(s){return rstr2hex(raw_md5(s));}function raw_hmac_md5(k,d){return rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d));}function hex_hmac_md5(k,d){return rstr2hex(raw_hmac_md5(k,d));}$.md5=function(string,key,raw){if(!key){if(!raw){return hex_md5(string);}else{return raw_md5(string);}}if(!raw){return hex_hmac_md5(key,string);}else{return raw_hmac_md5(key,string);}};}(typeof jQuery==="function"?jQuery:this));