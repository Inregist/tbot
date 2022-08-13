export const convertTimeframe = (tf: string) => {
  return {
    "1": "1m",
    "3": "3m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "45": "45m",
    "60": "1H",
    "120": "2H",
    "180": "3H",
    "240": "4H",
    "D": "1D",
    "5D": "5D",
    "W": "1W",
    "M": "1M",
  }[tf]
}