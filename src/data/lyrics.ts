import yorushikaLyrics from './yorushika-lyrics.json'
import nbunaLyrics from './nbuna-lyrics.json'
import zutomayoLyrics from './zutomayo-lyrics.json'
import lyricTitleTranslations from './lyric-title-translations.json'

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
  albums: LyricAlbum[]
  singles: string[]
  details: Record<string, LyricSongDetails>
  titleTranslations: Record<string, string>
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
    details: yorushikaLyrics as Record<string, LyricSongDetails>,
    titleTranslations: lyricTitleTranslations.yorushika
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
    details: nbunaLyrics as Record<string, LyricSongDetails>,
    titleTranslations: lyricTitleTranslations['n-buna']
  },
  {
    slug: 'zutomayo',
    name: 'ずっと真夜中でいいのに。',
    albums: [
      {
        title: '正しい偽りからの起床',
        songs: [
          '秒針を噛む',
          'ヒューマノイド',
          'サターン',
          '雲丹と栗',
          '脳裏上のクラッカー',
          '君がいて水になる'
        ]
      },
      {
        title: '今は今で誓いは笑みで',
        songs: [
          '勘冴えて悔しいわ',
          '正義',
          'またね幻',
          'マイノリティ脈絡',
          '彷徨い酔い温度',
          '眩しいDNAだけ'
        ]
      },
      {
        title: '潜潜話',
        songs: [
          '脳裏上のクラッカー',
          '勘冴えて悔しいわ',
          '居眠り遠征隊',
          'ハゼ馳せる果てるまで',
          '蹴っ飛ばした毛布',
          'Dear. Mr「F」',
          'こんなこと騒動',
          '眩しいDNAだけ',
          'ヒューマノイド',
          'グラスとラムレーズン',
          '正義',
          '優しくLAST SMILE',
          '秒針を噛む'
        ]
      },
      {
        title: '朗らかな皮膚とて不服',
        songs: [
          '低血ボルト',
          'お勉強しといてよ',
          'Ham',
          'JK BOMBER',
          'マリンブルーの庭園',
          'MILABO'
        ]
      },
      {
        title: 'ぐされ',
        songs: [
          '胸の煙',
          '正しくなれない',
          'お勉強しといてよ',
          '勘ぐれい',
          'はゔぁ',
          '機械油',
          '暗く黒く',
          'MILABO',
          'ろんりねす',
          '繰り返す収穫',
          '過眠',
          '低血ボルト',
          '奥底に眠るルーツ'
        ]
      },
      {
        title: '伸び仕草懲りて暇乞い',
        songs: [
          '違う曲にしようよ',
          '袖のキルト',
          'あいつら全員同窓会',
          '猫リセット',
          '夜中のキスミ',
          'ばかじゃないのに'
        ]
      },
      {
        title: '沈香学',
        songs: [
          '花一匁',
          '残機',
          '猫リセット',
          '綺羅キラー (feat. Mori Calliope)',
          '馴れ合いサーブ',
          'あいつら全員同窓会',
          '夏枯れ',
          '袖のキルト',
          '不法侵入',
          'ばかじゃないのに',
          '消えてしまいそうです',
          'ミラーチューン',
          '上辺の私自身なんだよ'
        ]
      },
      {
        title: '虚仮の一念海馬に託す',
        songs: ['虚仮にしてくれ', 'TAIDADA', 'クズリ念', '海馬成長痛', '嘘じゃない', 'Blues in the Closet']
      },
      {
        title: '形藻土',
        songs: [
          '地球存在しない説',
          '間人間',
          'メディアノーチェ',
          'TAIDADA',
          '蟹しゃぶふぁんく',
          '微熱魔',
          'クリームで会いにいけますか (Disco Re-Edit)',
          'またね幻 (Live in Studio_80光年先の君へ)',
          'シェードの埃は延長',
          '形',
          'ultra魂',
          '不死身の訓練',
          '海馬成長痛',
          'アンチモン',
          'よもすがら',
          'クズリ念 (Live in Studio_温蔵庫)',
          '嘘じゃない',
          'lowmotion algae'
        ]
      }
    ],
    singles: ['イチジク煙'],
    details: zutomayoLyrics as Record<string, LyricSongDetails>,
    titleTranslations: lyricTitleTranslations.zutomayo
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

export function getArtistLyricSongs(artist: LyricArtist): string[] {
  return getArtistSongs(artist).filter((title) => artist.details[title]?.lines.length)
}

export function getSongHref(artist: LyricArtist, title: string): string {
  return `/lyrics/${artist.slug}/${songSlug(title)}/`
}
