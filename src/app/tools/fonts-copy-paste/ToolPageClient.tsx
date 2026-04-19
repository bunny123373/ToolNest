'use client';

import { useState, useMemo } from 'react';

const fontStyles: { name: string; transform: (text: string) => string; popular?: boolean }[] = [
  {
    name: 'Small Caps',
    transform: (text) => text.toLowerCase().split('').map(c => c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D00) : c).join(''),
    popular: true,
  },
  {
    name: 'Bold',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D00) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D00) : c).join(''),
    popular: true,
  },
  {
    name: 'Italic',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D34) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D34) : c).join(''),
    popular: true,
  },
  {
    name: 'Bold Italic',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D20) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D20) : c).join(''),
    popular: true,
  },
  {
    name: 'Script',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D49E) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D49E) : c).join(''),
  },
  {
    name: 'Script Bold',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D4D0) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D4D0) : c).join(''),
  },
  {
    name: 'Monospace',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D68A) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D68A) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1D7CE) : c).join(''),
  },
  {
    name: 'Double Struck',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D538) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D552) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1D7D8) : c).join(''),
  },
  {
    name: 'Circles',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x24B6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x24D0) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x2450) : c).join(''),
    popular: true,
  },
  {
    name: 'Squares',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F130) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F130) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1F160) : c).join(''),
    popular: true,
  },
  {
    name: 'Fullwidth',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126 ? String.fromCharCode(c.charCodeAt(0) - 33 + 0xFF00) : c).join(''),
    popular: true,
  },
  {
    name: 'Gothic',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x2100) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x2100) : c).join(''),
  },
  {
    name: 'Circles Black',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x24C8) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x24C8) : c).join(''),
  },
  {
    name: 'Underline',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D1A) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D1A) : c).join(''),
  },
  {
    name: 'Zalgo',
    transform: (text) => text.split('').map(c => {
      if (c === ' ') return c;
      const combining = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F'];
      const chars = [c];
      for (let i = 0; i < 3; i++) {
        chars.push(combining[Math.floor(Math.random() * combining.length)]);
      }
      return chars.join('');
    }).join(''),
  },
  {
    name: 'Upside Down',
    transform: (text) => text.split('').reverse().map(c => {
      const map: Record<string, string> = { 'a': '\u0250', 'b': 'q', 'c': '\u0254', 'd': 'p', 'e': '\u01DD', 'f': '\u025F', 'g': '\u0261', 'h': 'h', 'i': '\u0268', 'j': '\u0279', 'k': '\u026A', 'l': '\u029E', 'm': '\u026F', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': '\u0279', 's': 's', 't': '\u0287', 'u': 'n', 'v': '\u028C', 'w': '\u028D', 'x': 'x', 'y': '\u028E', 'z': 'z', 'A': '\u0250', 'B': 'q', 'C': '\u0254', 'D': 'P', 'E': '\u01DD', 'F': '\u025F', 'G': '\u0261', 'H': 'H', 'I': '\u0268', 'J': '\u0279', 'K': '\u026A', 'L': '\u029E', 'M': '\u026F', 'N': 'N', 'O': 'O', 'P': 'D', 'Q': 'b', 'R': '\u0279', 'S': 'S', 'T': '\u0287', 'U': 'N', 'V': '\u028C', 'W': '\u028D', 'X': 'X', 'Y': '\u028E', 'Z': 'Z', '0': '0', '1': '\u01BB', '2': 'z', '3': '\u0190', '4': '\u152E', '5': 'S', '6': '9', '7': 'L', '8': '8', '9': '6', '.': '\u02D9', ',': "'", '?': '\u00BF', '!': '\u00A1', '"': ',,', "'": ',', '(': ')', ')': '(', '{': '}', '}': '{', '[': ']', ']': '[', '<': '>', '>': '<' };
      return map[c] || c;
    }).join(''),
  },
  {
    name: 'Bubbles',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F151) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F151) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1F179) : c).join(''),
  },
  {
    name: 'Math Bold',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D400) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D400) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1D7CE) : c).join(''),
  },
  {
    name: 'Math Italic',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D434) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D434) : c).join(''),
  },
  {
    name: 'Math Bold Italic',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D468) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D468) : c).join(''),
  },
  {
    name: 'Math Script',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D49C) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D49C) : c).join(''),
  },
  {
    name: 'Math Bold Script',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D4D0) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D4D0) : c).join(''),
  },
  {
    name: 'Math Monospace',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D68A) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D68A) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1D7CE) : c).join(''),
  },
  {
    name: 'Math Double Struck',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D538) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D552) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1D7D8) : c).join(''),
  },
  {
    name: 'Parenthesized',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F110) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F110) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1F110) : c).join(''),
  },
  {
    name: 'Corners',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F110) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F110) : c).join(''),
  },
  {
    name: 'Stars',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1E6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1E6) : c).join(''),
  },
  {
    name: 'Hearts',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1E6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1E6) : c).join(''),
  },
  {
    name: 'Dingbats',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F5BB) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F5BB) : c).join(''),
  },
  {
    name: 'Symbols',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F170) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F170) : c).join(''),
  },
  {
    name: 'Apartment',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F170) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F170) : c).join(''),
  },
  {
    name: 'Uptown',
    transform: (text) => text.split('').map(c => c >= 'A' && c <= 'Z' ? c : c >= 'a' && c <= 'z' ? c.toUpperCase() : c).join(''),
  },
  {
    name: 'Downtown',
    transform: (text) => text.split('').map(c => c >= 'A' && c <= 'Z' ? c.toLowerCase() : c >= 'a' && c <= 'z' ? c.toUpperCase() : c).join(''),
  },
  {
    name: 'Squared',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1A6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1A6) : c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57 ? String.fromCharCode(c.charCodeAt(0) - 48 + 0x1F1A6) : c).join(''),
  },
  {
    name: 'Negative Circles',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1A6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1A6) : c).join(''),
  },
  {
    name: 'Speech Bubble',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1E6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1E6) : c).join(''),
  },
  {
    name: 'Flags',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1F1E6) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1F1E6) : c).join(''),
  },
  {
    name: 'Censor',
    transform: (text) => text.split('').map(() => '█').join(''),
  },
  {
    name: 'Blurry',
    transform: (text) => text.split('').map(c => c === ' ' ? ' ' : c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D504) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D504) : c).join(''),
  },
  {
    name: 'Wide',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126 ? String.fromCharCode(c.charCodeAt(0) - 33 + 0xFF00) : c).join(''),
  },
  {
    name: 'Title',
    transform: (text) => text.replace(/\b\w/g, l => l.toUpperCase()),
  },
  {
    name: ' alternating ',
    transform: (text) => text.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''),
  },
  {
    name: 'Inverted',
    transform: (text) => text.split('').map(c => {
      const map: Record<string, string> = { 'a': '\u0250', 'b': 'q', 'c': '\u0254', 'd': 'p', 'e': '\u01DD', 'f': '\u025F', 'g': '\u0261', 'h': 'h', 'i': '\u0268', 'j': '\u0279', 'k': '\u026A', 'l': '\u029E', 'm': '\u026F', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': '\u0279', 's': 's', 't': '\u0287', 'u': 'n', 'v': '\u028C', 'w': '\u028D', 'x': 'x', 'y': '\u028E', 'z': 'z' };
      return map[c.toLowerCase()] || c;
    }).reverse().join(''),
  },
  {
    name: 'Binary',
    transform: (text) => text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
  },
  {
    name: 'Octal',
    transform: (text) => text.split('').map(c => c.charCodeAt(0).toString(8)).join(' '),
  },
  {
    name: 'Hex',
    transform: (text) => text.split('').map(c => c.charCodeAt(0).toString(16).toUpperCase()).join(' '),
  },
  {
    name: 'Strikethrough',
    transform: (text) => text.split('').map(c => c + '\u0336').join(''),
  },
  {
    name: 'Underline2',
    transform: (text) => text.split('').map(c => c + '\u0321').join(''),
  },
  {
    name: 'Overline',
    transform: (text) => text.split('').map(c => c + '\u0305').join(''),
  },
  {
    name: 'Double Underline',
    transform: (text) => text.split('').map(c => c + '\u0333').join(''),
  },
  {
    name: 'Tilde',
    transform: (text) => text.split('').map(c => c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90 ? String.fromCharCode(c.charCodeAt(0) - 65 + 0x1D550) : c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122 ? String.fromCharCode(c.charCodeAt(0) - 97 + 0x1D550) : c).join(''),
  },
  {
    name: 'Plus Underline',
    transform: (text) => text.split('').map(c => c + '\u0347').join(''),
  },
  {
    name: 'Dot Below',
    transform: (text) => text.split('').map(c => c + '\u0323').join(''),
  },
  {
    name: 'Dot Above',
    transform: (text) => text.split('').map(c => c + '\u0307').join(''),
  },
  {
    name: 'Diaeresis',
    transform: (text) => text.split('').map(c => c + '\u0308').join(''),
  },
  {
    name: 'Breve',
    transform: (text) => text.split('').map(c => c + '\u0306').join(''),
  },
  {
    name: 'Caron',
    transform: (text) => text.split('').map(c => c + '\u030C').join(''),
  },
  {
    name: 'Acute',
    transform: (text) => text.split('').map(c => c + '\u0301').join(''),
  },
  {
    name: 'Grave',
    transform: (text) => text.split('').map(c => c + '\u0300').join(''),
  },
  {
    name: 'Circumflex',
    transform: (text) => text.split('').map(c => c + '\u0302').join(''),
  },
  {
    name: 'Tilde Below',
    transform: (text) => text.split('').map(c => c + '\u0330').join(''),
  },
  {
    name: 'Comma Below',
    transform: (text) => text.split('').map(c => c + '\u0326').join(''),
  },
  {
    name: 'Telugu Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Bold Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x3000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Outline',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x4000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Rounded',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x5000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Light',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x6000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Telugu Medium',
    transform: (text) => text.split('').map(c => c).join(''),
  },
  {
    name: 'Telugu SemiBold',
    transform: (text) => text.split('').map(c => c).join(''),
  },
  {
    name: 'Hindi Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0901 && code <= 0x097F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Hindi Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0901 && code <= 0x097F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Hindi Bold Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0901 && code <= 0x097F) {
        return String.fromCharCode(code + 0x3000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Tamil Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0B01 && code <= 0x0B7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Tamil Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0B01 && code <= 0x0B7F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Tamil Bold Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0B01 && code <= 0x0B7F) {
        return String.fromCharCode(code + 0x3000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Kannada Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Kannada Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0C01 && code <= 0x0C7F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Malayalam Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0D01 && code <= 0x0D7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Malayalam Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0D01 && code <= 0x0D7F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Bengali Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0980 && code <= 0x09FF) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Bengali Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0980 && code <= 0x09FF) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Gujrati Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0A81 && code <= 0x0AFF) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Gujrati Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0A81 && code <= 0x0AFF) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Punjabi Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0A01 && code <= 0x0A7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Punjabi Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0A01 && code <= 0x0A7F) {
        return String.fromCharCode(code + 0x2000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Oriya Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0B01 && code <= 0x0B7F) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
  {
    name: 'Assamese Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 0x0980 && code <= 0x09FF) {
        return String.fromCharCode(code + 0x1000);
      }
      return c;
    }).join(''),
  },
];

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return fontStyles.map(style => ({
      ...style,
      transformed: style.transform(input),
    }));
  }, [input]);

  const popularResults = useMemo(() => results.filter(r => r.popular), [results]);
  const regularResults = useMemo(() => results.filter(r => !r.popular), [results]);

  const copyToClipboard = async (text: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(styleName);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      alert('Failed to copy');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const clearInput = () => {
    setInput('');
  };

  const copyAll = async () => {
    const popularText = popularResults.map(r => `${r.name}: ${r.transformed}`).join('\n\n');
    const regularText = regularResults.map(r => `${r.name}: ${r.transformed}`).join('\n\n');
    const allText = `POPULAR STYLES\n${popularText}\n\nALL STYLES\n${regularText}`;
    try {
      await navigator.clipboard.writeText(allText);
      alert('All fonts copied!');
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔤</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Fonts Copy Paste Style</h1>
          <p className="text-text-secondary">Copy and paste text with fancy fonts and styles</p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your text here..."
            className="w-full px-5 py-4 bg-surface-elevated border border-border rounded-2xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {input && (
            <button
              onClick={clearInput}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={copyAll}
              className="px-4 py-2 bg-primary text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy All
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {results.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-semibold text-text-primary">Popular</span>
                <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{popularResults.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {popularResults.map((result) => (
                  <div
                    key={result.name}
                    className="bg-surface-elevated border-2 border-primary/30 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-secondary text-sm font-medium">{result.name}</span>
                      <button
                        onClick={() => copyToClipboard(result.transformed, result.name)}
                        className="px-3 py-1.5 text-sm bg-surface-hover hover:bg-primary/20 text-text-primary hover:text-primary rounded-lg transition-all flex items-center gap-1.5"
                      >
                        {copied === result.name ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xl text-text-primary font-medium overflow-x-auto whitespace-nowrap">{result.transformed}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4 mt-8">
                <span className="text-lg font-semibold text-text-primary">All Fonts</span>
                <span className="px-2 py-0.5 text-xs bg-surface-hover text-text-secondary rounded-full">{regularResults.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularResults.map((result) => (
                  <div
                    key={result.name}
                    className="bg-surface-elevated border border-border rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-secondary text-sm font-medium">{result.name}</span>
                      <button
                        onClick={() => copyToClipboard(result.transformed, result.name)}
                        className="px-3 py-1.5 text-sm bg-surface-hover hover:bg-primary/20 text-text-primary hover:text-primary rounded-lg transition-all flex items-center gap-1.5"
                      >
                        {copied === result.name ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xl text-text-primary font-medium overflow-x-auto whitespace-nowrap">{result.transformed}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-10 p-6 bg-surface-elevated border border-border rounded-2xl">
            <h2 className="text-lg font-semibold text-text-primary mb-4">How to use</h2>
            <p className="text-text-secondary">
              Enter your text in the input field above. Then click &quot;Copy&quot; on any style you like to copy it to your clipboard.
              You can then paste the styled text in social media posts, bios, comments, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}