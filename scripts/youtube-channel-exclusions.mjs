const excludedChannelIds = new Set([
  'UC1QxOK5YpyAyFCN_xiPfgHw',
  'UCDSQC_AwS35z81Qyh3qcOCw',
  'UCX6fKN_3fpg5aq_G9WinaBg',
  'UCaIpvkwJK1MnSNqAhGzvxiw',
  'UCecWa3HTef2Z3BxTd1eY06A',
  'UCl1BFmAQ6Fuql7sJQCpRymw',
  'UCwDMBp-QKNRoyFRHkvQZvWQ'
])

export function isExcludedYouTubeChannel(id) {
  return excludedChannelIds.has(id)
}
