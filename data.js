const DASHBOARD_DATA_CONFIG = Object.freeze({
  sources: {
    me: {
      label: "Chây đờ",
      shortLabel: "CHÂY ĐỜ",
      file: "index_me.csv",
      color: "#141414",
      width: 2.2,
    },
    btc: {
      label: "BTC",
      shortLabel: "BTC",
      file: "index_btc.csv",
      color: "#f7931a",
      width: 3,
    },
    wp: {
      label: "WP",
      shortLabel: "WP",
      file: "index_wp.csv",
      color: "#8b0000",
      width: 3,
    },
  },
  primaryKey: "me",
  lagTargetKey: "btc",
});
