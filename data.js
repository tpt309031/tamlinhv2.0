const DASHBOARD_DATA_CONFIG = Object.freeze({
  "sources": {
    "me": {
      "label": "Chây đờ",
      "shortLabel": "CHÂY ĐỜ",
      "file": "index_me.csv",
      "color": "#141414",
      "width": 2.2
    },
    "btc": {
      "label": "BTC",
      "shortLabel": "BTC",
      "file": "index_btc.csv",
      "color": "#f7931a",
      "width": 3
    },
    "wp": {
      "label": "WP",
      "shortLabel": "WP",
      "file": "index_wp.csv",
      "color": "#8b0000",
      "width": 3
    }
  },
  "primaryKey": "me",
  "lagTargetKey": "btc",
  "transit": {
    "financeColor": "#f7931a",
    "lowColor": "#d94b4b",
    "midColor": "#77b7df",
    "highColor": "#9bd8a4"
  }
});

const BTC_TRANSIT_DATA = Object.freeze([
  {
    "date": "2026-06-20",
    "adjFinance": 52,
    "adjVolatility": 51
  },
  {
    "date": "2026-06-21",
    "adjFinance": 47,
    "adjVolatility": 62
  },
  {
    "date": "2026-06-22",
    "adjFinance": 47,
    "adjVolatility": 50
  },
  {
    "date": "2026-06-23",
    "adjFinance": 22,
    "adjVolatility": 45
  },
  {
    "date": "2026-06-24",
    "adjFinance": 29,
    "adjVolatility": 39
  },
  {
    "date": "2026-06-25",
    "adjFinance": 29,
    "adjVolatility": 43
  },
  {
    "date": "2026-06-26",
    "adjFinance": 29,
    "adjVolatility": 55
  },
  {
    "date": "2026-06-27",
    "adjFinance": 26,
    "adjVolatility": 51
  },
  {
    "date": "2026-06-28",
    "adjFinance": 26,
    "adjVolatility": 52
  },
  {
    "date": "2026-06-29",
    "adjFinance": 0,
    "adjVolatility": 90
  },
  {
    "date": "2026-06-30",
    "adjFinance": 0,
    "adjVolatility": 100
  },
  {
    "date": "2026-07-01",
    "adjFinance": 10,
    "adjVolatility": 81
  },
  {
    "date": "2026-07-02",
    "adjFinance": 10,
    "adjVolatility": 89
  },
  {
    "date": "2026-07-03",
    "adjFinance": 2,
    "adjVolatility": 81
  },
  {
    "date": "2026-07-04",
    "adjFinance": 2,
    "adjVolatility": 81
  },
  {
    "date": "2026-07-05",
    "adjFinance": 1,
    "adjVolatility": 73
  },
  {
    "date": "2026-07-06",
    "adjFinance": 0,
    "adjVolatility": 85
  },
  {
    "date": "2026-07-07",
    "adjFinance": 11,
    "adjVolatility": 78
  },
  {
    "date": "2026-07-08",
    "adjFinance": 4,
    "adjVolatility": 67
  },
  {
    "date": "2026-07-09",
    "adjFinance": 21,
    "adjVolatility": 72
  },
  {
    "date": "2026-07-10",
    "adjFinance": 18,
    "adjVolatility": 73
  },
  {
    "date": "2026-07-11",
    "adjFinance": 15,
    "adjVolatility": 83
  },
  {
    "date": "2026-07-12",
    "adjFinance": 21,
    "adjVolatility": 72
  },
  {
    "date": "2026-07-13",
    "adjFinance": 28,
    "adjVolatility": 73
  },
  {
    "date": "2026-07-14",
    "adjFinance": 23,
    "adjVolatility": 84
  },
  {
    "date": "2026-07-15",
    "adjFinance": 25,
    "adjVolatility": 84
  },
  {
    "date": "2026-07-16",
    "adjFinance": 28,
    "adjVolatility": 50
  },
  {
    "date": "2026-07-17",
    "adjFinance": 18,
    "adjVolatility": 66
  },
  {
    "date": "2026-07-18",
    "adjFinance": 45,
    "adjVolatility": 48
  },
  {
    "date": "2026-07-19",
    "adjFinance": 43,
    "adjVolatility": 53
  },
  {
    "date": "2026-07-20",
    "adjFinance": 39,
    "adjVolatility": 58
  },
  {
    "date": "2026-07-21",
    "adjFinance": 36,
    "adjVolatility": 63
  },
  {
    "date": "2026-07-22",
    "adjFinance": 32,
    "adjVolatility": 68
  },
  {
    "date": "2026-07-23",
    "adjFinance": 18,
    "adjVolatility": 77
  },
  {
    "date": "2026-07-24",
    "adjFinance": 35,
    "adjVolatility": 55
  },
  {
    "date": "2026-07-25",
    "adjFinance": 29,
    "adjVolatility": 63
  },
  {
    "date": "2026-07-26",
    "adjFinance": 25,
    "adjVolatility": 80
  },
  {
    "date": "2026-07-27",
    "adjFinance": 55,
    "adjVolatility": 75
  },
  {
    "date": "2026-07-28",
    "adjFinance": 53,
    "adjVolatility": 65
  },
  {
    "date": "2026-07-29",
    "adjFinance": 90,
    "adjVolatility": 73
  },
  {
    "date": "2026-07-30",
    "adjFinance": 86,
    "adjVolatility": 60
  },
  {
    "date": "2026-07-31",
    "adjFinance": 87,
    "adjVolatility": 55
  },
  {
    "date": "2026-08-01",
    "adjFinance": 81,
    "adjVolatility": 46
  },
  {
    "date": "2026-08-02",
    "adjFinance": 76,
    "adjVolatility": 45
  },
  {
    "date": "2026-08-03",
    "adjFinance": 60,
    "adjVolatility": 42
  },
  {
    "date": "2026-08-04",
    "adjFinance": 56,
    "adjVolatility": 33
  },
  {
    "date": "2026-08-05",
    "adjFinance": 51,
    "adjVolatility": 30
  },
  {
    "date": "2026-08-06",
    "adjFinance": 51,
    "adjVolatility": 25
  },
  {
    "date": "2026-08-07",
    "adjFinance": 45,
    "adjVolatility": 29
  },
  {
    "date": "2026-08-08",
    "adjFinance": 39,
    "adjVolatility": 31
  },
  {
    "date": "2026-08-09",
    "adjFinance": 36,
    "adjVolatility": 46
  },
  {
    "date": "2026-08-10",
    "adjFinance": 28,
    "adjVolatility": 53
  },
  {
    "date": "2026-08-11",
    "adjFinance": 24,
    "adjVolatility": 56
  },
  {
    "date": "2026-08-12",
    "adjFinance": 42,
    "adjVolatility": 64
  },
  {
    "date": "2026-08-13",
    "adjFinance": 22,
    "adjVolatility": 86
  },
  {
    "date": "2026-08-14",
    "adjFinance": 23,
    "adjVolatility": 53
  },
  {
    "date": "2026-08-15",
    "adjFinance": 26,
    "adjVolatility": 63
  },
  {
    "date": "2026-08-16",
    "adjFinance": 17,
    "adjVolatility": 57
  },
  {
    "date": "2026-08-17",
    "adjFinance": 24,
    "adjVolatility": 37
  },
  {
    "date": "2026-08-18",
    "adjFinance": 26,
    "adjVolatility": 35
  },
  {
    "date": "2026-08-19",
    "adjFinance": 28,
    "adjVolatility": 33
  },
  {
    "date": "2026-08-20",
    "adjFinance": 23,
    "adjVolatility": 42
  },
  {
    "date": "2026-08-21",
    "adjFinance": 18,
    "adjVolatility": 48
  },
  {
    "date": "2026-08-22",
    "adjFinance": 11,
    "adjVolatility": 64
  },
  {
    "date": "2026-08-23",
    "adjFinance": 22,
    "adjVolatility": 61
  },
  {
    "date": "2026-08-24",
    "adjFinance": 25,
    "adjVolatility": 56
  },
  {
    "date": "2026-08-25",
    "adjFinance": 21,
    "adjVolatility": 47
  },
  {
    "date": "2026-08-26",
    "adjFinance": 22,
    "adjVolatility": 41
  },
  {
    "date": "2026-08-27",
    "adjFinance": 29,
    "adjVolatility": 40
  },
  {
    "date": "2026-08-28",
    "adjFinance": 33,
    "adjVolatility": 46
  },
  {
    "date": "2026-08-29",
    "adjFinance": 36,
    "adjVolatility": 40
  },
  {
    "date": "2026-08-30",
    "adjFinance": 37,
    "adjVolatility": 27
  },
  {
    "date": "2026-08-31",
    "adjFinance": 29,
    "adjVolatility": 37
  },
  {
    "date": "2026-09-01",
    "adjFinance": 31,
    "adjVolatility": 31
  },
  {
    "date": "2026-09-02",
    "adjFinance": 32,
    "adjVolatility": 33
  },
  {
    "date": "2026-09-03",
    "adjFinance": 23,
    "adjVolatility": 49
  },
  {
    "date": "2026-09-04",
    "adjFinance": 26,
    "adjVolatility": 38
  },
  {
    "date": "2026-09-05",
    "adjFinance": 29,
    "adjVolatility": 43
  },
  {
    "date": "2026-09-06",
    "adjFinance": 49,
    "adjVolatility": 40
  },
  {
    "date": "2026-09-07",
    "adjFinance": 53,
    "adjVolatility": 33
  },
  {
    "date": "2026-09-08",
    "adjFinance": 56,
    "adjVolatility": 28
  },
  {
    "date": "2026-09-09",
    "adjFinance": 46,
    "adjVolatility": 23
  },
  {
    "date": "2026-09-10",
    "adjFinance": 41,
    "adjVolatility": 33
  },
  {
    "date": "2026-09-11",
    "adjFinance": 36,
    "adjVolatility": 54
  },
  {
    "date": "2026-09-12",
    "adjFinance": 32,
    "adjVolatility": 41
  },
  {
    "date": "2026-09-13",
    "adjFinance": 32,
    "adjVolatility": 38
  },
  {
    "date": "2026-09-14",
    "adjFinance": 56,
    "adjVolatility": 33
  },
  {
    "date": "2026-09-15",
    "adjFinance": 58,
    "adjVolatility": 27
  },
  {
    "date": "2026-09-16",
    "adjFinance": 61,
    "adjVolatility": 28
  },
  {
    "date": "2026-09-17",
    "adjFinance": 57,
    "adjVolatility": 11
  },
  {
    "date": "2026-09-18",
    "adjFinance": 55,
    "adjVolatility": 7
  },
  {
    "date": "2026-09-19",
    "adjFinance": 51,
    "adjVolatility": 12
  },
  {
    "date": "2026-09-20",
    "adjFinance": 48,
    "adjVolatility": 12
  },
  {
    "date": "2026-09-21",
    "adjFinance": 47,
    "adjVolatility": 19
  },
  {
    "date": "2026-09-22",
    "adjFinance": 46,
    "adjVolatility": 25
  },
  {
    "date": "2026-09-23",
    "adjFinance": 37,
    "adjVolatility": 17
  },
  {
    "date": "2026-09-24",
    "adjFinance": 37,
    "adjVolatility": 33
  },
  {
    "date": "2026-09-25",
    "adjFinance": 32,
    "adjVolatility": 32
  },
  {
    "date": "2026-09-26",
    "adjFinance": 24,
    "adjVolatility": 61
  },
  {
    "date": "2026-09-27",
    "adjFinance": 20,
    "adjVolatility": 68
  },
  {
    "date": "2026-09-28",
    "adjFinance": 25,
    "adjVolatility": 48
  },
  {
    "date": "2026-09-29",
    "adjFinance": 30,
    "adjVolatility": 48
  },
  {
    "date": "2026-09-30",
    "adjFinance": 31,
    "adjVolatility": 40
  },
  {
    "date": "2026-10-01",
    "adjFinance": 33,
    "adjVolatility": 38
  },
  {
    "date": "2026-10-02",
    "adjFinance": 26,
    "adjVolatility": 45
  },
  {
    "date": "2026-10-03",
    "adjFinance": 28,
    "adjVolatility": 45
  },
  {
    "date": "2026-10-04",
    "adjFinance": 37,
    "adjVolatility": 32
  },
  {
    "date": "2026-10-05",
    "adjFinance": 43,
    "adjVolatility": 31
  },
  {
    "date": "2026-10-06",
    "adjFinance": 48,
    "adjVolatility": 17
  },
  {
    "date": "2026-10-07",
    "adjFinance": 43,
    "adjVolatility": 29
  },
  {
    "date": "2026-10-08",
    "adjFinance": 46,
    "adjVolatility": 16
  },
  {
    "date": "2026-10-09",
    "adjFinance": 47,
    "adjVolatility": 21
  },
  {
    "date": "2026-10-10",
    "adjFinance": 42,
    "adjVolatility": 35
  },
  {
    "date": "2026-10-11",
    "adjFinance": 43,
    "adjVolatility": 28
  },
  {
    "date": "2026-10-12",
    "adjFinance": 42,
    "adjVolatility": 12
  },
  {
    "date": "2026-10-13",
    "adjFinance": 41,
    "adjVolatility": 12
  },
  {
    "date": "2026-10-14",
    "adjFinance": 40,
    "adjVolatility": 11
  },
  {
    "date": "2026-10-15",
    "adjFinance": 39,
    "adjVolatility": 10
  },
  {
    "date": "2026-10-16",
    "adjFinance": 38,
    "adjVolatility": 20
  },
  {
    "date": "2026-10-17",
    "adjFinance": 47,
    "adjVolatility": 22
  },
  {
    "date": "2026-10-18",
    "adjFinance": 44,
    "adjVolatility": 14
  },
  {
    "date": "2026-10-19",
    "adjFinance": 48,
    "adjVolatility": 24
  },
  {
    "date": "2026-10-20",
    "adjFinance": 45,
    "adjVolatility": 10
  },
  {
    "date": "2026-10-21",
    "adjFinance": 51,
    "adjVolatility": 23
  },
  {
    "date": "2026-10-22",
    "adjFinance": 50,
    "adjVolatility": 19
  },
  {
    "date": "2026-10-23",
    "adjFinance": 53,
    "adjVolatility": 25
  },
  {
    "date": "2026-10-24",
    "adjFinance": 47,
    "adjVolatility": 23
  },
  {
    "date": "2026-10-25",
    "adjFinance": 41,
    "adjVolatility": 26
  },
  {
    "date": "2026-10-26",
    "adjFinance": 40,
    "adjVolatility": 45
  },
  {
    "date": "2026-10-27",
    "adjFinance": 41,
    "adjVolatility": 30
  },
  {
    "date": "2026-10-28",
    "adjFinance": 41,
    "adjVolatility": 31
  },
  {
    "date": "2026-10-29",
    "adjFinance": 35,
    "adjVolatility": 23
  },
  {
    "date": "2026-10-30",
    "adjFinance": 37,
    "adjVolatility": 30
  },
  {
    "date": "2026-10-31",
    "adjFinance": 27,
    "adjVolatility": 39
  },
  {
    "date": "2026-11-01",
    "adjFinance": 28,
    "adjVolatility": 36
  },
  {
    "date": "2026-11-02",
    "adjFinance": 31,
    "adjVolatility": 25
  },
  {
    "date": "2026-11-03",
    "adjFinance": 28,
    "adjVolatility": 37
  },
  {
    "date": "2026-11-04",
    "adjFinance": 30,
    "adjVolatility": 29
  },
  {
    "date": "2026-11-05",
    "adjFinance": 35,
    "adjVolatility": 45
  },
  {
    "date": "2026-11-06",
    "adjFinance": 24,
    "adjVolatility": 49
  },
  {
    "date": "2026-11-07",
    "adjFinance": 29,
    "adjVolatility": 34
  },
  {
    "date": "2026-11-08",
    "adjFinance": 28,
    "adjVolatility": 35
  },
  {
    "date": "2026-11-09",
    "adjFinance": 28,
    "adjVolatility": 52
  },
  {
    "date": "2026-11-10",
    "adjFinance": 29,
    "adjVolatility": 50
  },
  {
    "date": "2026-11-11",
    "adjFinance": 31,
    "adjVolatility": 34
  },
  {
    "date": "2026-11-12",
    "adjFinance": 30,
    "adjVolatility": 47
  },
  {
    "date": "2026-11-13",
    "adjFinance": 42,
    "adjVolatility": 49
  },
  {
    "date": "2026-11-14",
    "adjFinance": 50,
    "adjVolatility": 45
  },
  {
    "date": "2026-11-15",
    "adjFinance": 45,
    "adjVolatility": 31
  },
  {
    "date": "2026-11-16",
    "adjFinance": 44,
    "adjVolatility": 26
  },
  {
    "date": "2026-11-17",
    "adjFinance": 43,
    "adjVolatility": 25
  },
  {
    "date": "2026-11-18",
    "adjFinance": 42,
    "adjVolatility": 25
  },
  {
    "date": "2026-11-19",
    "adjFinance": 41,
    "adjVolatility": 25
  },
  {
    "date": "2026-11-20",
    "adjFinance": 38,
    "adjVolatility": 21
  },
  {
    "date": "2026-11-21",
    "adjFinance": 35,
    "adjVolatility": 28
  },
  {
    "date": "2026-11-22",
    "adjFinance": 41,
    "adjVolatility": 30
  },
  {
    "date": "2026-11-23",
    "adjFinance": 41,
    "adjVolatility": 33
  },
  {
    "date": "2026-11-24",
    "adjFinance": 33,
    "adjVolatility": 60
  },
  {
    "date": "2026-11-25",
    "adjFinance": 37,
    "adjVolatility": 46
  },
  {
    "date": "2026-11-26",
    "adjFinance": 40,
    "adjVolatility": 42
  },
  {
    "date": "2026-11-27",
    "adjFinance": 33,
    "adjVolatility": 43
  },
  {
    "date": "2026-11-28",
    "adjFinance": 38,
    "adjVolatility": 35
  },
  {
    "date": "2026-11-29",
    "adjFinance": 41,
    "adjVolatility": 38
  },
  {
    "date": "2026-11-30",
    "adjFinance": 37,
    "adjVolatility": 50
  },
  {
    "date": "2026-12-01",
    "adjFinance": 43,
    "adjVolatility": 36
  },
  {
    "date": "2026-12-02",
    "adjFinance": 37,
    "adjVolatility": 48
  },
  {
    "date": "2026-12-03",
    "adjFinance": 37,
    "adjVolatility": 37
  },
  {
    "date": "2026-12-04",
    "adjFinance": 39,
    "adjVolatility": 24
  },
  {
    "date": "2026-12-05",
    "adjFinance": 40,
    "adjVolatility": 23
  },
  {
    "date": "2026-12-06",
    "adjFinance": 40,
    "adjVolatility": 21
  },
  {
    "date": "2026-12-07",
    "adjFinance": 44,
    "adjVolatility": 28
  },
  {
    "date": "2026-12-08",
    "adjFinance": 41,
    "adjVolatility": 20
  },
  {
    "date": "2026-12-09",
    "adjFinance": 39,
    "adjVolatility": 39
  },
  {
    "date": "2026-12-10",
    "adjFinance": 40,
    "adjVolatility": 31
  },
  {
    "date": "2026-12-11",
    "adjFinance": 43,
    "adjVolatility": 31
  },
  {
    "date": "2026-12-12",
    "adjFinance": 43,
    "adjVolatility": 37
  },
  {
    "date": "2026-12-13",
    "adjFinance": 44,
    "adjVolatility": 37
  },
  {
    "date": "2026-12-14",
    "adjFinance": 38,
    "adjVolatility": 26
  },
  {
    "date": "2026-12-15",
    "adjFinance": 44,
    "adjVolatility": 31
  },
  {
    "date": "2026-12-16",
    "adjFinance": 44,
    "adjVolatility": 20
  },
  {
    "date": "2026-12-17",
    "adjFinance": 40,
    "adjVolatility": 35
  },
  {
    "date": "2026-12-18",
    "adjFinance": 49,
    "adjVolatility": 33
  },
  {
    "date": "2026-12-19",
    "adjFinance": 48,
    "adjVolatility": 26
  },
  {
    "date": "2026-12-20",
    "adjFinance": 53,
    "adjVolatility": 41
  },
  {
    "date": "2026-12-21",
    "adjFinance": 54,
    "adjVolatility": 39
  },
  {
    "date": "2026-12-22",
    "adjFinance": 52,
    "adjVolatility": 46
  },
  {
    "date": "2026-12-23",
    "adjFinance": 59,
    "adjVolatility": 35
  },
  {
    "date": "2026-12-24",
    "adjFinance": 62,
    "adjVolatility": 56
  },
  {
    "date": "2026-12-25",
    "adjFinance": 71,
    "adjVolatility": 28
  },
  {
    "date": "2026-12-26",
    "adjFinance": 68,
    "adjVolatility": 41
  },
  {
    "date": "2026-12-27",
    "adjFinance": 77,
    "adjVolatility": 30
  },
  {
    "date": "2026-12-28",
    "adjFinance": 72,
    "adjVolatility": 44
  },
  {
    "date": "2026-12-29",
    "adjFinance": 77,
    "adjVolatility": 35
  },
  {
    "date": "2026-12-30",
    "adjFinance": 78,
    "adjVolatility": 27
  },
  {
    "date": "2026-12-31",
    "adjFinance": 72,
    "adjVolatility": 20
  }
]);
