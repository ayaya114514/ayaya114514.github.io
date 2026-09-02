import yorushikaLyrics from './yorushika-lyrics.json'
import nbunaLyrics from './nbuna-lyrics.json'
import zutomayoLyrics from './zutomayo-lyrics.json'
import orangestarLyrics from './orangestar-lyrics.json'
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
  },
  {
    slug: 'orangestar',
    name: 'Orangestar',
    albums: [
      {
        title: '未完成エイトビーツ',
        songs: [
          '或るひと夏の追憶',
          '空奏列車',
          'シンクロナイザー',
          '真夏と少年の天ノ川戦争',
          '残灯花火',
          'イヤホンと蝉時雨',
          '超次元愛歌',
          'Ifの世界設定',
          'からっぽの街月夜の下',
          '夏色アンサー',
          '白昼都市サブマージ計画',
          'アスノヨゾラ哨戒班',
          '花と記憶',
          '雨き声残響',
          '未完成タイムリミッター'
        ]
      },
      {
        title: '未収録OSC',
        songs: ['CITRUS', '心象蜃気楼', 'キミノヨゾラ哨戒班', 'Lingering Fireworks', '時ノ雨、最終戦争', '新世界LIVE']
      },
      {
        title: 'SEASIDE SOLILOQUIES',
        songs: [
          'Alice in 冷凍庫',
          '水星',
          'Trash Day',
          'DAYBREAK FRONTLINE',
          'Uz',
          'Still-GATE',
          'White Landscape',
          'RIP',
          '濫觴生命',
          'サンダルリープ',
          '回る空うさぎ',
          '八十八鍵の宇宙',
          'DAYBREAK FRONTLINE (Acoustic Remix)'
        ]
      },
      {
        title: 'Light in the Distance',
        songs: ['灯台', 'MOON-VINE', '夜蝉 (feat. 夏背)', 'ノクティルーカ (Cover)', 'Sunflower (feat. 夏背)']
      },
      {
        title: 'And So Henceforth,',
        songs: [
          'Henceforth',
          'Surges',
          '滑走',
          '霽れを待つ',
          '白南風',
          'Pier',
          'Skywards',
          'Artificial Light',
          'MOON-VINE (ASH ver.)',
          'Aloud (ASH ver.)',
          'ノクティルーカ (ASH ver.)',
          '快晴'
        ]
      },
      {
        title: 'Postscript',
        songs: ['Postscript', 'Aloud (P.S. ver.)', '白南風 (P.S. ver.)', 'ノクティルーカ (feat. 夏背 & 遼遼)']
      }
    ],
    singles: ['Nadir', 'Encounter', 'Petals', '花筏'],
    details: orangestarLyrics as Record<string, LyricSongDetails>,
    titleTranslations: lyricTitleTranslations.orangestar
  },
  {
    slug: 'fujii-kaze',
    name: '藤井 風',
    albums: [
      {
        title: 'HELP EVER HURT NEVER',
        songs: [
          '何なw',
          'もうええわ',
          '優しさ',
          'キリがないから',
          '罪の香り',
          '調子のっちゃって',
          '特にない',
          '死ぬのがいいわ',
          '風よ',
          'さよならべいべ',
          '帰ろう'
        ]
      },
      {
        title: 'HELP EVER HURT COVER',
        songs: [
          'Close to you',
          'Shape Of You',
          'Back Stabbers',
          'Alfie',
          'Be Alright',
          'Beat It',
          "Don't Let Me Be Misunderstood",
          'My Eyes Adored You',
          'Shake It Off',
          'Stronger Than Me',
          'Time After Time'
        ]
      },
      {
        title: 'LOVE ALL SERVE ALL',
        songs: [
          'きらり',
          'まつり',
          'へでもねーよ (LASA edit)',
          'やば。',
          '燃えよ',
          'ガーデン',
          'damn',
          'ロンリーラプソディ',
          'それでは、',
          '“青春病”',
          '旅路'
        ]
      },
      {
        title: 'LOVE ALL COVER ALL',
        songs: [
          'Sunny',
          'No Tears Left To Cry',
          'Hot Stuff',
          'Sorry',
          'Good As Hell',
          'Just the Two of Us',
          'Weak',
          'Overprotected',
          'Teenage Dream',
          'Eh, Eh',
          'Circles'
        ]
      },
      {
        title: 'Best of Fujii Kaze 2020-2024',
        songs: ['まつり', 'Workin’ Hard', '何なw', 'きらり', '花', 'ガーデン', 'damn', '死ぬのがいいわ', '旅路', '満ちてゆく']
      },
      {
        title: 'Prema',
        songs: [
          'Casket Girl',
          'I Need U Back',
          'Hachikō',
          'Love Like This',
          'Prema',
          "It Ain't Over",
          'You',
          'Okay, Goodbye',
          'Forever Young'
        ]
      },
      {
        title: 'Pre: Prema',
        songs: ['grace', 'Feelin’ Go(o)d', 'Workin’ Hard', 'It’s Alright', '花', '満ちてゆく', '真っ白']
      }
    ],
    singles: ['Comets＋Gold'],
    details: {},
    titleTranslations: {}
  },
  {
    slug: 'radwimps',
    name: 'RADWIMPS',
    albums: [
      {
        title: 'RADWIMPS',
        songs: [
          '人生出会い',
          '自暴自棄自己中心的(思春期)自己依存症の少年',
          '心臓',
          'もしも「みんな一緒に」バージョン',
          'さみしい僕',
          'コンドーム',
          '青い春',
          '「ぼく」と「僕」',
          'あいまい',
          '嫌ん',
          '「ずっと大好きだよ」「ほんと？・・・」',
          '愛へ',
          'あいラブユー'
        ]
      },
      {
        title: 'RADWIMPS 2 ～発展途上～',
        songs: [
          '愛し（かなし）～明くる明け～',
          'なんちって',
          'そりゃ君が好きだから',
          '夢見月に何想ふ',
          'ノットビコーズ',
          '愛し（かなし）',
          'うぃんぷす学園休み時間',
          'ヒキコモリロリン',
          '着席',
          '俺色スカイ',
          '音の葉',
          'シリメツレツ',
          '祈跡-in album version-',
          'ララバイ'
        ]
      },
      {
        title: 'RADWIMPS 3 ～無人島に持っていき忘れた一枚～',
        songs: [
          '4645',
          'セプテンバーさん',
          'イーディーピー ～飛んで火に入る夏の君～',
          '閉じた光',
          '25コ目の染色体',
          '揶揄',
          '螢',
          'おとぎ',
          '最大公約数',
          'へっくしゅん',
          'トレモロ',
          '最後の歌'
        ]
      },
      {
        title: 'RADWIMPS 4 ～おかずのごはん～',
        songs: [
          'ふたりごと (一生に一度のワープVer.)',
          'ギミギミック',
          '05410-(ん)',
          'me me she',
          '有心論',
          '遠恋',
          'セツナレンサ',
          'いいんですか？',
          '指切りげんまん',
          '傘拍子',
          'ます。',
          '夢番地',
          'バグッバイ'
        ]
      },
      {
        title: 'アルトコロニーの定理',
        songs: [
          'タユタ',
          'おしゃかしゃま',
          'バグパイプ',
          '謎謎',
          '七ノ歌',
          'One man live',
          'ソクラティックラブ',
          'メルヘンとグレーテル',
          '雨音子',
          'オーダーメイド',
          '魔法鏡',
          '叫べ',
          '37458'
        ]
      },
      {
        title: '絶体絶命',
        songs: [
          'DADA (dadadadaVer.)',
          '透明人間18号',
          '君と羊と青',
          'だいだらぼっち',
          '学芸会',
          '狭心症',
          'グラウンドゼロ',
          'Π',
          'G行為',
          'DUGOUT',
          'ものもらい',
          '携帯電話 (Cat Ver.)',
          '億万笑者',
          '救世主'
        ]
      },
      {
        title: '×と○と罪と',
        songs: [
          'いえない',
          '実況中継',
          'アイアンバイブル',
          'リユニオン',
          'DARMA GRAND PRIX',
          '五月の蝿',
          '最後の晩餐',
          '夕霧',
          'ブレス',
          'パーフェクトベイビー',
          'ドリーマーズ・ハイ',
          '会心の一撃',
          'Tummy',
          'ラストバージン',
          '針と棘'
        ]
      },
      {
        title: '君の名は。',
        songs: [
          '夢灯籠',
          '三葉の通学',
          '糸守高校',
          'はじめての、東京',
          '憧れカフェ',
          '奥寺先輩のテーマ',
          'ふたりの異変',
          '前前前世 (movie ver.)',
          '御神体',
          'デート',
          '秋祭り',
          '記憶を呼び起こす瀧',
          '飛騨探訪',
          '消えた町',
          '図書館',
          '旅館の夜',
          '御神体へ再び',
          '口噛み酒トリップ',
          '作戦会議',
          '町長説得',
          '三葉のテーマ',
          '見えないふたり',
          'かたわれ時',
          'スパークル (movie ver.)',
          'デート2',
          'なんでもないや (movie edit.)',
          'なんでもないや (movie ver.)'
        ]
      },
      {
        title: '人間開花',
        songs: [
          'Lights go out',
          '光',
          'AADAAKOODAA',
          'トアルハルノヒ',
          '前前前世 (original ver.)',
          "'I' Novel",
          'アメノヒニキク',
          '週刊少年ジャンプ',
          '棒人間',
          '記号として',
          'ヒトボシ',
          'スパークル (original ver.)',
          'Bring me the morning',
          'O&O',
          '告白'
        ]
      },
      {
        title: 'ANTI ANTI GENERATION',
        songs: [
          'Anti Anti overture',
          'tazuna',
          'NEVER EVER ENDER',
          'IKIJIBIKI feat. Taka',
          'カタルシスト',
          '洗脳 (Anti Anti Mix)',
          'そっけない',
          '<宿題発表-skit->',
          'PAPARAZZI～*この物語はフィクションです～',
          'HOCUSPOCUS',
          '万歳千唱',
          'I I U',
          '泣き出しそうだよ feat. あいみょん',
          'TIE TONGUE feat. Miyachi, Tabu Zombie',
          'Mountain Top',
          'サイハテアイニ',
          '正解 (18FES ver.)'
        ]
      },
      {
        title: '天気の子',
        songs: [
          '『天気の子』のテーマ',
          '優しさの味',
          'K&A 初訪問',
          '占秘館へようこそ',
          'K&A 入社式',
          '風たちの声 (Movie edit)',
          '陽菜、救出',
          '晴れゆく空',
          '空の海',
          '御宅訪問',
          '初の晴れ女バイト',
          '祝祭 (Movie edit) feat. 三浦透子',
          '花火大会',
          '気象神社',
          '芝公園',
          '二つの告白',
          '首都危機',
          '真夏の雪',
          '天気の力',
          '家族の時間',
          '消えゆく陽菜',
          '永遠の雲の上',
          '晴天と喪失',
          '帆高、逃走～子供達の画策',
          'バイクチェイス',
          '陽菜と、走る帆高',
          '愛にできることはまだあるかい (Movie edit)',
          'グランドエスケープ (Movie edit) feat. 三浦透子',
          'ふたたびの、雨',
          '大丈夫 (Movie edit)',
          '愛にできることはまだあるかい'
        ]
      },
      {
        title: '天気の子 complete version',
        songs: ['風たちの声', '祝祭 feat. 三浦透子', 'グランドエスケープ feat. 三浦透子', '大丈夫', '愛にできることはまだあるかい']
      },
      {
        title: '夏のせい ep',
        songs: ['夏のせい', '猫じゃらし', 'Light The Light', '新世界', 'ココロノナカ (Complete ver.)', '夏のせい (English ver.)']
      },
      {
        title: '2+0+2+1+3+1+1= 10 years 10 songs',
        songs: ['白日 (10 years ver.)', 'ブリキ', 'カイコ', 'あいとわ', '春灯', '空窓', '夜の淵', '世界の果て', 'かくれんぼ', 'あいたい']
      },
      {
        title: 'FOREVER DAZE',
        songs: [
          '海馬',
          'SHIWAKUCHA (feat. Awich)',
          '匿名希望',
          'TWILIGHT',
          '桃源郷',
          '夏のせい',
          'MAKAFUKA',
          'Tokyo (feat. iri)',
          'うたかた歌 (feat. 菅田将暉)',
          '犬じゃらし',
          'グランドエスケープ',
          'かたわれ',
          '鋼の羽根',
          'SUMMER DAZE 2021'
        ]
      },
      {
        title: '余命10年 ～Original Soundtrack～',
        songs: [
          'Opening of [余命10年]',
          '茉莉の現実',
          '7年後の五輪',
          'タイムカプセル',
          '最初のバイバイ',
          '挫折',
          '戸惑い',
          '病室での吐露',
          '小さなはじまり',
          '時が止まって見えた',
          '重なる四季',
          '罪なき声',
          'スカイツリーと私',
          '心の悲鳴',
          '茉莉の嘘',
          '二人の叫び',
          '和人の告白',
          '重ねる時間、残り時間',
          '大丈夫、じゃない',
          'ゲレンデ',
          '重ねる二人',
          '行き止まり',
          'キッチンの涙',
          'お姉ちゃんがお姉ちゃんでいてくれて',
          '消せない、消えない',
          '茉莉の夢',
          '涙袋',
          '届いた声',
          '君が止まって見えた',
          'うるうびと'
        ]
      },
      {
        title: 'すずめの戸締まり',
        songs: [
          '二人の出逢い',
          '廃壟の温泉街',
          '手当て',
          'キャットチェース',
          '夜のフェリー',
          '猫探し',
          '廃校の風景',
          '二人の時間',
          'ドライブ',
          '子守り',
          '廃遊園地',
          '戦士の休息',
          '新幹線の旅',
          'ミミズの歴史',
          '予兆',
          '東京上空',
          '決意～旅立ち',
          '狐憑き',
          '自転車の二人',
          '夢じゃなかった',
          '常世',
          '丘上の要石',
          '草太の元へ',
          '祈り',
          '戸締まり',
          'カナタハルカ',
          'すずめ (feat. 十明)',
          'Tamaki',
          'すずめの涙'
        ]
      },
      {
        title: '正解',
        songs: ['正解', '正解 (混声三部合唱)', '正解 (女声三部合唱)', '正解 (Instrumental)', '正解 (合唱ピアノ伴奏)']
      },
      {
        title: 'あにゅー',
        songs: [
          '命題',
          'まーふぁか',
          'ワールドエンドガールフレンド',
          'DASAI DAZAI',
          'なんていう',
          '賜物',
          'MOUNTAIN VANILLA',
          'Odakyu Line',
          '筆舌',
          'ピリオド。',
          '成れの果てで鳴れ',
          'ピアフ',
          '大団円 (feat. ZORN) [Anew Version]',
          '賜物 (Orchestra Version)'
        ]
      }
    ],
    singles: [
      'アンチクローン',
      'ささくれ',
      'ラバボー',
      'ジェニファー山田さん',
      'バイ・マイ・サイ',
      'グーの音',
      'マニフェスト',
      'やどかり',
      'ハイパーベンチレイション',
      '縷々',
      '寿限夢',
      'シュプレヒコール',
      '独白',
      'シザースタンド',
      '白と黒と4匹のワルツ',
      'にっぽんぽん',
      'お風呂あがりの',
      'ピクニック',
      'Shape Of Miracle',
      'HINOMARU',
      '人間ごっこ',
      'KANASHIBARI (feat. ao)'
    ],
    details: {},
    titleTranslations: {}
  },
  {
    slug: 'sakanaction',
    name: 'サカナクション',
    albums: [
      {
        title: 'GO TO THE FUTURE',
        songs: ['三日月サンセット', 'インナーワールド', 'あめふら', 'GO TO THE FUTURE', 'フクロウ', '開花', '白波トップウォーター', '夜の東側']
      },
      {
        title: 'NIGHT FISHING',
        songs: ['ワード', 'サンプル', 'ナイトフィッシングイズグッド', '雨は気まぐれ', 'マレーシア32', 'うねり', 'ティーンエイジ', '哀愁トレイン', '新しい世界', 'アムスフィッシュ']
      },
      {
        title: 'シンシロ',
        songs: ['Ame(B)', 'ライトダンス', 'セントレイ (シンシロ ver.)', 'ネイティブダンサー', 'minnanouta', '雑踏', '黄色い車', 'enough', '涙ディライト', 'アドベンチャー', 'human']
      },
      {
        title: 'kikUUiki',
        songs: ['intro = 汽空域', '潮', 'YES NO', 'アルクアラウンド', 'Klee', '21.1', 'アンダー', 'シーラカンスと僕', '明日から', '表参道26時', '壁', '目が明く藍色']
      },
      {
        title: 'DocumentaLy',
        songs: ['RL', 'アイデンティティ', 'モノクロトウキョー', 'ルーキー', 'アンタレスと針', '仮面の街', '流線', 'エンドレス', 'DocumentaRy', '『バッハの旋律を夜に聴いたせいです。』', 'years', 'ドキュメント']
      },
      {
        title: 'sakanaction',
        songs: ['intro', 'INORI', 'ミュージック', '夜の踊り子', 'なんてったって春', 'アルデバラン', 'M', 'Aoi', 'ボイル', '映画', '僕と花', 'mellow', 'ストラクチャー', '朝の歌']
      },
      {
        title: '懐かしい月は新しい月 ～Coupling & Remix works～',
        songs: [
          'ホーリーダンス',
          'Ame(A)',
          'multiple exposure',
          'years',
          '映画 (コンテ 2012/11/16 17:24)',
          'スローモーション',
          'もどかしい日々',
          'スプーンと汗',
          'ネプトゥーヌス',
          'montage',
          'ナイトフィッシングイズグッド (Iw_Remix)',
          'ミュージック (Ej_Remix)',
          'アイデンティティ (Ks_Remix)',
          'GO TO THE FUTURE (2006 ver.)',
          'グッドバイ (NEXT WORLD REMIX)',
          'Ame(B) -SAKANATRIBE × ATM version-',
          'ルーキー (Takkyu Ishino Remix)',
          '三日月サンセット (FPM EVERLUST MIX)',
          'ライトダンス YSST Remix 2015',
          '映画 (AOKI takamasa Remix)',
          'サンプル (cosmic version)',
          'さよならはエモーション (Qrion Remix)',
          'YES NO (AOKI takamasa Remix)',
          '夜の踊り子 (agraph Remix)',
          'ミュージック (Cornelius Remix)',
          'ネイティブダンサー (rei harakami へっぽこre-arrange)'
        ]
      },
      {
        title: '魚図鑑',
        songs: [
          '新宝島', '夜の踊り子', 'Aoi', 'ルーキー', 'アイデンティティ', 'ライトダンス', 'セントレイ', '僕と花', '『バッハの旋律を夜に聴いたせいです。』', 'ミュージック', 'モノクロトウキョー', 'Klee', '表参道26時', 'アルクアラウンド', 'アドベンチャー', 'ナイトフィッシングイズグッド', '陽炎 -movie version-',
          'ワード', '三日月サンセット', 'ネイティブダンサー', 'ホーリーダンス', 'なんてったって春', 'サンプル', '白波トップウォーター', '夜の東側', 'スローモーション', '涙ディライト', '明日から', '仮面の街', 'エンドレス', 'years', 'ボイル', 'ドキュメント', '目が明く藍色'
        ]
      },
      {
        title: '834.194',
        songs: [
          '忘れられないの', 'マッチとピーナッツ', '陽炎', '多分、風。', '新宝島', 'モス', '「聴きたかったダンスミュージック、リキッドルームに」', 'ユリイカ (Shotaro Aoyama Remix)', 'セプテンバー -東京 version-',
          'グッドバイ', '蓮の花 -single version-', 'ユリイカ', 'ナイロンの糸', '茶柱', 'ワンダーランド', 'さよならはエモーション', '834.194', 'セプテンバー -札幌 version-'
        ]
      },
      {
        title: 'アダプト',
        songs: ['塔', 'キャラバン', '月の椀', 'プラトー', 'ショック！', 'エウリュノメー', 'シャンディガフ', 'フレンドリー', 'DocumentaRy of ADAPT']
      },
      {
        title: '懐かしい月は新しい月 Vol. 2 ～Rearrange & Remix works～',
        songs: [
          'インナーワールド -Rearrange 2023-', '新宝島 -Rearrange 2020-', 'アルデバラン -Rearrange 2023-', '夜の東側 -Rearrange 2020-', 'ホーリーダンス -Rearrange 2023-', 'ユリイカ -Rearrange 2021-', 'アドベンチャー -Rearrange 2023-', 'エンドレス -Rearrange 2023-', '茶柱 -Rearrange 2019-', 'サンプル -Rearrange 2023-', '三日月サンセット -Rearrange 2020-', 'ボイル -Rearrange 2023-', 'ナイロンの糸 -Rearrange 2019-', 'シーラカンスと僕 -Rearrange 2020-', '忘れられないの -Rearrange 2020-', '白波トップウォーター -Rearrange 2020-',
          'エンドレス (YonYon Remix)', 'ナイロンの糸 (Kuniyuki Takahashi Long Dub Version)', '新宝島 (hf remix)', 'フクロウ (hf remix)', 'years (Floating Points Remix)', 'フレンドリー (Cornelius Remix)', '目が明く藍色 (agraph remix)'
        ]
      }
    ],
    singles: ['moon', '怪獣', 'いらない'],
    details: {},
    titleTranslations: {}
  },
  {
    slug: 'back-number',
    name: 'back number',
    albums: [
      {
        title: '逃した魚',
        songs: ['重なり', '春を歌にして', 'sympathy', 'then', '海岸通り', 'KNOCK', '西藤公園']
      },
      {
        title: 'あとのまつり',
        songs: ['stay with me', 'あとのうた', '浮ついた気持ち', '風の強い日', 'tender', 'そのドレスちょっと待った', 'おまえさん', 'ハイスクールガール', 'Life', 'fallman', 'march', 'いつか忘れてしまっても']
      },
      {
        title: 'スーパースター',
        songs: ['はなびら', 'スーパースターになったら', '花束', '思い出せなくなるその日まで', 'あやしいひかり', '半透明人間', 'チェックのワンピース', 'ミスターパーフェクト', 'こぼれ落ちて', 'リッツパーティー', '電車の窓から', '幸せ']
      },
      {
        title: 'blues',
        songs: ['青い春', '手の鳴る方へ', 'わたがし', 'エンディング', '日曜日', '平日のブルース', '笑顔', 'ささえる人の歌', "bird's sorrow", '助演女優症', '僕が今できることを', '恋']
      },
      {
        title: 'ラブストーリー',
        songs: ['聖者の行進', '繋いだ手から', '003', 'fish', '光の街', '高嶺の花子さん', 'MOTTO', '君がドアを閉めた後', 'こわいはなし', 'ネタンデルタール人', '頰を濡らす雨のように', '世田谷ラブストーリー']
      },
      {
        title: 'シャンデリア',
        songs: ['SISTER', 'サイレン', 'ヒロイン', '僕は君の事が好きだけど君は僕を別に好きじゃないみたい', '泡と羊', 'ミラーボールとシンデレラ', 'クリスマスソング', '助演女優症2', '東京の夕焼け', 'Liar', 'アップルパイ', '手紙']
      },
      {
        title: 'アンコール',
        songs: [
          '高嶺の花子さん', '花束', 'ハッピーエンド', 'クリスマスソング', 'はなびら', '黒い猫の歌', 'fish', '君がドアを閉めた後', '青い春', '光の街', 'stay with me', 'MOTTO', '恋', '世田谷ラブストーリー', '半透明人間', '日曜日',
          '春を歌にして', '僕の名前を', 'SISTER', '助演女優症', '繋いだ手から', 'エンディング', 'そのドレスちょっと待った', 'わたがし', '電車の窓から', 'ヒロイン', '幸せ', 'アップルパイ', '003', '手紙', '思い出せなくなるその日まで', 'スーパースターになったら'
        ]
      },
      {
        title: 'MAGIC',
        songs: ['最深部', 'サマーワンダーランド', '瞬き', 'あかるいよるに', 'ARTIST', 'オールドファッション', 'ロンリネス', '雨と僕の話', 'エキシビジョンデスマッチ', 'monaural fantasy', 'HAPPY BIRTHDAY', '大不正解']
      },
      {
        title: 'ユーモア',
        songs: ['秘密のキス', '怪盗', 'アイラブユー', 'ゴールデンアワー', '黄色', '添い寝チャンスは突然に', 'Silent Journey in Tokyo', 'エメラルド', 'ベルベットの詩', '赤い花火', 'ヒーロースーツ', '水平線']
      }
    ],
    singles: [
      'だいじなこと', 'はじまりはじまり', '信者よ盲目であれ', 'one room', 'アイアムノットイナフ', '君の代わり', '反省線急行自宅行き', 'バースデー', '優柔不断宣言', '遠吠え', 'アーバンライフ', '君はいらないだろうな', 'Hey!Brother!', 'パレード', 'ひとくいにんげん', '君の恋人になったら', '魔女と僕', 'reunion', 'ゆめなのであれば', '強化書', 'Jaguar', 'ジャスティスインザボックス', '勝手にオリンピック', '怪獣のサイズ', '冬と春', '新しい恋人達に', '楽園の地図', 'ブルーアンバー', 'ある未来より愛を込めて', '幕が上がる', 'どうしてもどうしても'
    ],
    details: {},
    titleTranslations: {}
  },
  {
    slug: 'mrs-green-apple',
    name: 'Mrs. GREEN APPLE',
    albums: [
      {
        title: 'Introduction',
        songs: ['HeLLo', '藍', 'スターダム', 'FACTORY', 'リスキーゲーム', '慶びの種']
      },
      {
        title: 'Progressive',
        songs: ['我逢人', 'ナニヲナニヲ', 'CONFLICT', 'アンゼンパイ', '日々と君', 'WaLL FloWeR']
      },
      {
        title: 'Variety',
        songs: ['StaRt', 'リスキーゲーム', 'L.P', 'VIP', 'ゼンマイ', '道徳と皿']
      },
      {
        title: 'TWELVE',
        songs: ['愛情と矛先', 'Speaking', 'パブリック', '藍(あお)', 'キコリ時計', '私', 'No.7', 'ミスカサズ', 'SimPle', 'InTerLuDe ～白い朝～', 'Hug', 'HeLLo', '庶幾の唄']
      },
      {
        title: 'Mrs. GREEN APPLE',
        songs: ['Lion', 'In the Morning', 'おもちゃの兵隊', '絶世生物', 'soFt-dRink', '鯨の唄', 'うブ', 'サママ・フェスティバル！', 'Oz (Album Version)', 'Just a Friend', 'FACTORY', 'umbrella (Album Version)', 'JOURNEY']
      },
      {
        title: 'ENSEMBLE',
        songs: ['Love me, Love you (ENSEMBLE Version)', 'PARTY', 'WanteD! WanteD!', 'アウフヘーベン', 'はじまり feat. キヨサク from MONGOL800', 'They are', 'WHOO WHOO WHOO', 'スマイロブドリーマ', 'SPLASH!!!', 'REVERSE', 'Coffee', 'On My MiND (Album Version)', 'どこかで日は昇る (Album Mix)']
      },
      {
        title: 'Attitude',
        songs: ['InsPirATioN', 'Attitude', 'インフェルノ', 'CHEERS', 'Viking', 'ProPose', '僕のこと', '青と夏', 'クダリ', "lovin'", 'Ke-Mo Sah-Bee', 'ロマンチシズム', '嘘じゃないよ', 'How-to', 'Soup', 'Circle', 'Folktale']
      },
      {
        title: '5',
        songs: ['スターダム', '我逢人', 'StaRt', 'Speaking', 'パブリック', 'サママ・フェスティバル！', 'In the Morning', '鯨の唄', 'どこかで日は昇る', 'WanteD! WanteD!', 'Love me, Love you', 'アウフヘーベン', '青と夏', '僕のこと', 'ロマンチシズム', 'インフェルノ', 'アボイドノート', 'PRESENT (Japanese ver.)', 'Theater']
      },
      {
        title: 'Unity',
        songs: ['ニュー・マイ・ノーマル', 'ダンスホール', 'ブルーアンビエンス (feat. asmi)', '君を知らない', '延々', 'Part of me']
      },
      {
        title: 'ANTENNA',
        songs: ['ANTENNA', 'Magic', '私は最強', 'Blizzard', 'ケセラセラ', 'Soranji', 'アンラブレス', 'Loneliness', 'norn', '橙', 'Doodle', 'BFF', 'Feeling']
      },
      {
        title: 'The White Lounge in CINEMA - Original Soundtrack -',
        songs: ['The White Lounge', 'Folktale (The White Lounge Version)', '君を知らない (The White Lounge Version)', 'ダンスホール (The White Lounge Version)', 'ツキマシテハ (The White Lounge Version)', 'Coffee (The White Lounge Version)', 'ニュー・マイ・ノーマル (The White Lounge Version)', 'PARTY (The White Lounge Version)', '春愁 (The White Lounge Version)', 'Just a Friend (The White Lounge Version)', 'Attitude (The White Lounge Version)', 'Feeling (The White Lounge Version)', 'ケセラセラ (The White Lounge Version)', 'Soranji (The White Lounge Version)', 'The White Lounge -reprise-', 'フロリジナル (The White Lounge Version)']
      },
      {
        title: '10',
        songs: ['ニュー・マイ・ノーマル', 'ダンスホール', 'Soranji', '私は最強', 'ケセラセラ', 'Magic', 'ANTENNA', 'ナハトムジーク', 'ライラック', 'Dear', 'コロンブス', 'アポロドロス', 'familie', 'ビターバカンス', 'ダーリン', 'クスシキ', '天国', 'breakfast', '慶びの種', '道徳と皿 ～2025 ver.～']
      }
    ],
    singles: ['恋と吟', 'えほん', 'ノニサクウタ', 'SwitCh', '光のうた', 'Log (feat. 坂口有望)', '点描の唄 (feat. 井上苑子)', 'ア・プリオリ', '灯火', '月とアネモネ', 'あなたに', 'Carrying Happiness', '夏の影', 'GOOD DAY', 'lulu.', '風と町', 'Brand New'],
    details: {},
    titleTranslations: {}
  },
  {
    slug: 'aimyon',
    name: 'あいみょん',
    albums: [
      {
        title: 'tamago',
        songs: ['貴方解剖純愛歌 ～死ね～', '分かってくれよ', 'お互い様やん', '○○ちゃん', '夜行バス', '幸せになりたい', '強がりました', 'ナウなヤングにバカウケするのは当たり前だのクラッ歌']
      },
      {
        title: '憎まれっ子世に懚る',
        songs: ['どうせ死ぬなら', '19歳になりたくない', '好きって言ってよ', '泥だんごの天才いたよね', 'おっぱい', '私に彼氏ができない理由', 'ほろ酔い']
      },
      {
        title: '青春のエキサイトメント',
        songs: ['憧れてきたんだ', '生きていたんだよな', '君はロックを聴かない', 'マトリョーシカ', 'ふたりの世界', 'いつまでも', '愛を伝えたいだとか', '風のささやき', 'RING DING', 'ジェニファー', '漂白']
      },
      {
        title: '瞬間的シックスセンス',
        songs: ['満月の夜なら', 'マリーゴールド', 'ら、のはなし', '二人だけの国', 'プレゼント', 'ひかりもの', '恋をしたから', '夢追いベンガル', '今夜このまま', 'あした世界が終わるとしても', 'GOOD NIGHT BABY', 'from 四階の角部屋']
      },
      {
        title: 'おいしいパスタがあると聞いて',
        songs: ['黄昏にバカ話をしたあの日を思い出す時を', 'ハルノヒ', 'シガレット', 'さよならの今日に', '朝陽', '裸の心', 'マシマロ', '空の青さを知る人よ', '真夏の夜の匂いがする', 'ポプリの葉', 'チカ', 'そんな風に生きている']
      },
      {
        title: '瞳へ落ちるよレコード',
        songs: ['双葉', 'スーパーガール', '姿', '初恋が泣いている', '君のこゝろ', '3636', '強くなっちゃったんだ、ブルー', '桜が降る夜は', 'ペルソナの記憶', '神秘の領域へ', 'ハート', 'インタビュー', '愛を知るまでは']
      },
      {
        title: '猫にジェラシー',
        songs: ['私に見せてよ', '会いに行くのに', 'ラッキーカラー', '駅前喫茶ポプラ', 'あのね', 'ノット・オーケー', 'リズム64', '炎曜日', '偽者', '朝が嫌い', 'ざらめ', '愛の花', '猫にジェラシー']
      }
    ],
    singles: ['いいことしましょ', '今日の芸術', '君がいない夜を越えられやしない', 'ハッピー', 'MIO', '青春と青春と青春', 'わかってない', 'あなたのために', '鯉', 'テレパしい', '葵', 'ユラユラ', 'ミニスカートとハイライト', '森のくまさん', '皐月', '彼氏有無', 'die die die', 'ねむい', 'スケッチ', '君の夢を聞きながら、僕は笑えるアイデアを！', 'おばけがでるぞ', 'いちについて'],
    details: {},
    titleTranslations: {}
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
