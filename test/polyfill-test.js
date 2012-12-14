buster.testCase(
  'encode',
  {
    'single character': function() {
      assert.equals(btoa(String.fromCharCode(0)), "AA==");
    },
    '0x00': function() {
      assert.equals(btoa(String.fromCharCode(0, 0, 0)), "AAAA");
    },
    '0xff': function() {
      assert.equals(btoa(String.fromCharCode(0xff, 0xff, 0xff)), "////");
    },
    'wide character': function() {
      assert.exception(function () {
        btoa(String.fromCharCode(0x100, 0x100, 0x100))
      });
    },
    "safe unicode": function() {
      assert.equals(btoa("\u0000"), "AA==");
    },
    "unsafe unicode": function() {
      assert.exception(function() {
        btoa("\uffff");
      });
    },
    "long data": function() {
      assert.equals(
        btoa(new Array(1e4).join('aaaaaaaaaaaa')),
        new Array(1e4).join("YWFhYWFhYWFhYWFh")
      );
    },
    "1-16 length": function() {
      var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      var result = [
        "AA==", "AAE=", "AAEC", "AAECAw==", "AAECAwQ=", "AAECAwQF",
        "AAECAwQFBg==", "AAECAwQFBgc=", "AAECAwQFBgcI", "AAECAwQFBgcICQ==",
        "AAECAwQFBgcICQo=", "AAECAwQFBgcICQoL", "AAECAwQFBgcICQoLDA==",
        "AAECAwQFBgcICQoLDA0=", "AAECAwQFBgcICQoLDA0O",
        "AAECAwQFBgcICQoLDA0ODw=="
      ];

      for (var i = 0; i < 16; ++i) {
        assert.equals(
          btoa(String.fromCharCode.apply(null, data.slice(0, i+1))),
          result[i]
        );
      }
    }
  }
);

buster.testCase(
  'decode',
  {
    'AAAA': function() {
      assert.equals(atob("AAAA"), String.fromCharCode(0, 0, 0));
    },
    '////': function() {
      assert.equals(function() {
        atob("////"), String.fromCharCode(0xff, 0xff, 0xff);
      });
    },
    'wide character': function() {
      assert.exception(function() {
        atob(String.fromCharCode(0x100, 0x100, 0x100));
      });
    },
    'unknown character': function() {
      assert.exception(function() {
        atob('____');
      });
    },
    'length % 4 === 1': function() {
      assert.exception(function() { atob('a'); });
      assert.exception(function() { atob('a='); });
      assert.exception(function() { atob('a=='); });
      assert.exception(function() { atob('a==='); });
      assert.exception(function() { atob('aaaaa'); });
      assert.exception(function() { atob('aaaaa='); });
      assert.exception(function() { atob('aaaaa=='); });
      assert.exception(function() { atob('aaaaa==='); });
    },
    'padding only': function() {
      assert.exception(function() { atob('='); });
      assert.exception(function() { atob('=='); });
      assert.exception(function() { atob('==='); });
      assert.exception(function() { atob('===='); });
    },
    "long data": function() {
      assert.equals(
        atob(new Array(1e4).join("YWFhYWFhYWFhYWFh")),
        new Array(1e4).join('aaaaaaaaaaaa')
      );
    },
    "1-16 length": function() {
      var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      var result = [
        "AA==", "AAE=", "AAEC", "AAECAw==", "AAECAwQ=", "AAECAwQF",
        "AAECAwQFBg==", "AAECAwQFBgc=", "AAECAwQFBgcI", "AAECAwQFBgcICQ==",
        "AAECAwQFBgcICQo=", "AAECAwQFBgcICQoL", "AAECAwQFBgcICQoLDA==",
        "AAECAwQFBgcICQoLDA0=", "AAECAwQFBgcICQoLDA0O",
        "AAECAwQFBgcICQoLDA0ODw=="
      ];

      for (var i = 0; i < 16; ++i) {
        assert.equals(
          atob(result[i]),
          String.fromCharCode.apply(null, data.slice(0, i+1))
        );
      }
    }
  }
);
