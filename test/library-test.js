buster.testCase(
  'encode',
  {
    'single character': function() {
      assert.equals(Base64.btoa(String.fromCharCode(0)), "AA==");
    },
    '0x00': function() {
      assert.equals(Base64.btoa(String.fromCharCode(0, 0, 0)), "AAAA");
    },
    '0xff': function() {
      assert.equals(Base64.btoa(String.fromCharCode(0xff, 0xff, 0xff)), "////");
    },
    // not strict
    '//wide character': function() {
      assert.exception(function () {
        Base64.btoa(String.fromCharCode(0x100, 0x100, 0x100))
      });
    },
    "safe unicode": function() {
      assert.equals(Base64.btoa("\u0000"), "AA==");
    },
    // not strict
    "//unsafe unicode": function() {
      assert.exception(function() {
        Base64.btoa("\uffff");
      });
    },
    "long data": function() {
      assert.equals(
        Base64.btoa(new Array(1e4).join('aaaaaaaaaaaa')),
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
          Base64.btoa(String.fromCharCode.apply(null, data.slice(0, i+1))),
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
      assert.equals(Base64.atob("AAAA"), String.fromCharCode(0, 0, 0));
    },
    '////': function() {
      assert.equals(function() {
        Base64.atob("////"), String.fromCharCode(0xff, 0xff, 0xff);
      });
    },
    'wide character': function() {
      assert.exception(function() {
        Base64.atob(String.fromCharCode(0x100, 0x100, 0x100));
      });
    },
    'unknown character': function() {
      assert.exception(function() {
        Base64.atob('____');
      });
    },
    'length % 4 === 1': function() {
      assert.exception(function() { Base64.atob('a'); });
      assert.exception(function() { Base64.atob('a='); });
      assert.exception(function() { Base64.atob('a=='); });
      assert.exception(function() { Base64.atob('a==='); });
      assert.exception(function() { Base64.atob('aaaaa'); });
      assert.exception(function() { Base64.atob('aaaaa='); });
      assert.exception(function() { Base64.atob('aaaaa=='); });
      assert.exception(function() { Base64.atob('aaaaa==='); });
    },
    'padding only': function() {
      assert.exception(function() { Base64.atob('='); });
      assert.exception(function() { Base64.atob('=='); });
      assert.exception(function() { Base64.atob('==='); });
      assert.exception(function() { Base64.atob('===='); });
    },
    "long data": function() {
      assert.equals(
        Base64.atob(new Array(1e4).join("YWFhYWFhYWFhYWFh")),
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
          Base64.atob(result[i]),
          String.fromCharCode.apply(null, data.slice(0, i+1))
        );
      }
    }
  }
);
