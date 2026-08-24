import yorushikaLyrics from './yorushika-lyrics.json'
import nbunaLyrics from './nbuna-lyrics.json'

export type LyricLine = {
  japanese: string
  chinese?: string
  breakBefore?: boolean
}

export type LyricSongDetails = {
  lines: LyricLine[]
}

export type LyricAlbum = {
  title: string
  songs: string[]
}

export type LyricArtist = {
  slug: string
  name: string
  alias?: string
  albums: LyricAlbum[]
  singles: string[]
  details: Record<string, LyricSongDetails>
}

const secondPersonSongs = [
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

export const lyricArtists: LyricArtist[] = [
  {
    slug: 'yorushika',
    name: 'ヨルシカ',
    alias: '夜鹿',
    albums: [
      {
        title: '夏草が邪魔をする',
        songs: ['夏陰、ピアノを弾く', 'カトレア', '言って。', 'あの夏に咲け', '飛行', '靴の花火', '雲と幽霊']
      },
      {
        title: '負け犬にアンコールはいらない',
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
        title: 'だから僕は音楽を辞めた',
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
        title: 'エルマ',
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
        title: '盗作',
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
        title: '創作',
        songs: ['強盗と花束', '春泥棒', '創作', '風を食む', '嘘月']
      },
      {
        title: '幻燈',
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
        title: '二人称',
        songs: secondPersonSongs
      }
    ],
    singles: ['あぶく', '茜', '斜陽', 'テレパス'],
    details: yorushikaLyrics as Record<string, LyricSongDetails>
  },
  {
    slug: 'n-buna',
    name: 'n-buna',
    albums: [
      {
        title: 'カーテンコールが止む前に',
        songs: [
          '一人きりロックショー',
          'スロイド',
          '透明エレジー',
          'アイラ',
          'また雨が降ったら',
          '七月、影法師、藍色、ロッカー',
          '夕立ち(inst)',
          '背景、夏に溺れる',
          'カーテンコールが止む前に',
          'ウミユリ海底譚',
          'ハイカラ色の',
          '夜に染まるまで',
          '劇場愛歌',
          'さよならワンダーノイズ'
        ]
      },
      {
        title: '花と水飴、最終電車',
        songs: [
          'もうじき夏が終わるから',
          '無人駅',
          '始発とカフカ',
          'ウミユリ海底譚',
          '昼青',
          '拝啓、夏に溺れる',
          'ヒグレギ',
          '透明エレジー',
          '夜祭前に',
          'メリュー',
          '着火、カウントダウン',
          '敬具',
          'ずっと空を見ていた',
          '夜明けと蛍',
          '花と水飴、最終電車'
        ]
      },
      {
        title: '月を歩いている',
        songs: [
          'モノローグ',
          'ルラ',
          '三月と狼少年',
          '歌う睡蓮',
          '花降らし',
          '落花',
          '泣いた振りをした',
          '白ゆき',
          'ラプンツェル',
          '落陽',
          '白ゆきの独白',
          'セロ弾き群青',
          'それでもいいよ。',
          'かぐや',
          'エピローグ',
          'カエルのはなし'
        ]
      }
    ],
    singles: ['初恋'],
    details: nbunaLyrics as Record<string, LyricSongDetails>
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

export function getSongHref(artist: LyricArtist, title: string): string {
  return `/lyrics/${artist.slug}/${songSlug(title)}/`
}
