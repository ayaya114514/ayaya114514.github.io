export type LyricLine = {
  japanese: string
  romaji: string
  chinese: string
}

export type LyricSource = {
  label: string
  url: string
  note: string
}

export type LyricSongDetails = {
  lines?: LyricLine[]
  note?: string
  sources?: LyricSource[]
}

export type LyricAlbum = {
  title: string
  songs: string[]
  sourceUrl: string
}

export type LyricArtist = {
  slug: string
  name: string
  alias?: string
  albums: LyricAlbum[]
  singles: string[]
  details: Record<string, LyricSongDetails>
}

const kanogomaSource = (title: string): LyricSource => ({
  label: 'Kanogoma｜中日罗马音',
  url: `https://kanogoma.com/song/${encodeURIComponent(`ヨルシカ-${title}`)}/`,
  note: '含日文、罗马音与中文对照，适合核对逐行排版。'
})

export const lyricArtists: LyricArtist[] = [
  {
    slug: 'yorushika',
    name: 'ヨルシカ',
    alias: '夜鹿',
    albums: [
      {
        title: '二人称',
        sourceUrl: 'https://yorushika.com/discography/detail/70/',
        songs: [
          '早朝、郵便受け',
          '雲になる',
          '花も騒めく',
          '魔性',
          'プレイシック',
          'ポスト春',
          '太陽',
          '晴る',
          '忘れてください',
          '修羅',
          '火星人',
          'ルバート',
          '火葬',
          'アポリア',
          'へび',
          'うめき',
          '啄木鳥',
          'ヒッチコック',
          '月光浴',
          '千鳥',
          '櫂',
          '海へ'
        ]
      },
      {
        title: '幻燈',
        sourceUrl: 'https://yorushika.com/discography/detail/30/',
        songs: [
          '夏の肖像',
          '都落ち',
          'ブレーメン',
          'チノカテ',
          '雪国',
          '月に吠える',
          '451',
          'パドドゥ',
          '又三郎',
          '靴の花火',
          '老人と海',
          'さよならモルテン',
          'いさな',
          '左右盲',
          'アルジャーノン',
          '第一夜',
          '第二夜',
          '第三夜',
          '第四夜',
          '第五夜',
          '第六夜',
          '第七夜',
          '第八夜',
          '第九夜',
          '第十夜'
        ]
      },
      {
        title: '創作',
        sourceUrl: 'https://yorushika.com/discography/detail/18/',
        songs: ['強盗と花束', '春泥棒', '創作', '風を食む', '嘘月']
      },
      {
        title: '盗作',
        sourceUrl: 'https://yorushika.com/discography/detail/15/',
        songs: [
          '音楽泥棒の自白',
          '昼鳶',
          '春ひさぎ',
          '爆弾魔',
          '青年期、空き巣',
          'レプリカント',
          '花人局',
          '朱夏期、音楽泥棒',
          '盗作',
          '思想犯',
          '逃亡',
          '幼年期、思い出の中',
          '夜行',
          '花に亡霊'
        ]
      },
      {
        title: 'エルマ',
        sourceUrl: 'https://yorushika.com/discography/detail/2/',
        songs: [
          '車窓',
          '憂一乗',
          '夕凪、某、花惑い',
          '雨とカプチーノ',
          '湖の街',
          '神様のダンス',
          '雨晴るる',
          '歩く',
          '心に穴が空いた',
          '森の教会',
          '声',
          'エイミー',
          '海底、月明かり',
          'ノーチラス'
        ]
      },
      {
        title: 'だから僕は音楽を辞めた',
        sourceUrl: 'https://yorushika.com/discography/detail/6/',
        songs: [
          '8/31',
          '藍二乗',
          '八月、某、月明かり',
          '詩書きとコーヒー',
          '7/13',
          '踊ろうぜ',
          '六月は雨上がりの街を書く',
          '五月は花緑青の窓辺から',
          '夜紛い',
          '5/6',
          'パレード',
          'エルマ',
          '4/10',
          'だから僕は音楽を辞めた'
        ]
      },
      {
        title: '負け犬にアンコールはいらない',
        sourceUrl: 'https://yorushika.com/discography/detail/7/',
        songs: [
          '前世',
          '負け犬にアンコールはいらない',
          '爆弾魔',
          'ヒッチコック',
          '落下',
          '準透明少年',
          'ただ君に晴れ',
          '冬眠',
          '夏、バス停、君を待つ'
        ]
      },
      {
        title: '夏草が邪魔をする',
        sourceUrl: 'https://yorushika.com/discography/detail/8/',
        songs: ['夏陰、ピアノを弾く', 'カトレア', '言って。', 'あの夏に咲け', '飛行', '靴の花火', '雲と幽霊']
      }
    ],
    singles: [
      'あぶく',
      '茜',
      'プレイシック',
      '修羅',
      '火星人',
      'へび',
      '太陽',
      'アポリア',
      '忘れてください',
      'ルバート',
      '晴る',
      '月光浴',
      '斜陽',
      '451',
      'アルジャーノン',
      'テレパス',
      'チノカテ',
      '左右盲',
      'ブレーメン',
      '月に吠える',
      '老人と海',
      '又三郎',
      '春泥棒',
      '風を食む',
      '盗作',
      '思想犯',
      '春ひさぎ',
      '花に亡霊',
      '夜行',
      '心に穴が空いた'
    ],
    details: {
      花人局: {
        note: '以下三行来自你提供的排版参考图；完整歌词请通过已筛选来源阅读。',
        lines: [
          {
            japanese: '今にドアが開いて聞こえる',
            romaji: 'ima ni doa ga hiraite kikoeru',
            chinese: '此刻只要打开门我便会听见'
          },
          {
            japanese: 'ごめんね、遅くなったって',
            romaji: 'gomen ne, osoku nattatte',
            chinese: '“对不起，我迟到了”'
          },
          {
            japanese: '言葉だけをずっと待っている',
            romaji: 'kotoba dake o zutto matteiru',
            chinese: '我一直在等待你开口说话'
          }
        ],
        sources: [
          kanogomaSource('花人局'),
          {
            label: '安安日本語｜中文翻译',
            url: 'https://www.youtube.com/watch?v=JrYFJExwTc0',
            note: '译者长期整理日语歌曲，可用于交叉核对语气。'
          },
          {
            label: 'Bilibili｜翻译与注释',
            url: 'https://www.bilibili.com/opus/685641758731665497',
            note: '包含标题双关与上下文注释，适合核对歧义。'
          }
        ]
      },
      だから僕は音楽を辞めた: {
        sources: [
          kanogomaSource('だから僕は音楽を辞めた'),
          {
            label: 'Rice Milk｜翻译与概念注释',
            url: 'https://ricemilkniconico.blogspot.com/2019/08/blog-post.html',
            note: '对标题结尾的双关读法给出了上下文说明。'
          }
        ]
      },
      準透明少年: { sources: [kanogomaSource('準透明少年')] },
      左右盲: { sources: [kanogomaSource('左右盲')] },
      櫂: { sources: [kanogomaSource('櫂')] },
      思想犯: { sources: [kanogomaSource('思想犯')] },
      藍二乗: { sources: [kanogomaSource('藍二乗')] },
      茜: {
        sources: [
          {
            label: 'KX Lyrics｜日中对照',
            url: 'https://kxlyrics.com/lyrics/199-%E8%8C%9C',
            note: '带假名标注与中文对照，可用于核对读音和句义。'
          }
        ]
      }
    }
  }
]

export function getArtist(slug: string): LyricArtist | undefined {
  return lyricArtists.find((artist) => artist.slug === slug)
}

export function songSlug(title: string): string {
  return Array.from(title)
    .map((character) => character.codePointAt(0)?.toString(36))
    .join('-')
}

export function getArtistSongs(artist: LyricArtist): string[] {
  return [...new Set([...artist.albums.flatMap((album) => album.songs), ...artist.singles])]
}

export function getSongReleases(artist: LyricArtist, title: string): string[] {
  const releases = artist.albums
    .filter((album) => album.songs.includes(title))
    .map((album) => album.title)

  if (artist.singles.includes(title)) releases.push('单曲')
  return releases
}

export function getSongHref(artist: LyricArtist, title: string): string {
  return `/lyrics/${artist.slug}/${songSlug(title)}/`
}
