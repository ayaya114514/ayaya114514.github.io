# 歌词合集导入核对

本次正文来自用户提供的《全部歌手-中日歌词合集.txt》。网页资料用于核对歌曲身份、读音、曲式和歌名，不替换供稿中的中文歌词。

## 收录范围

- 合集去重后 829 首：1 首已收录，821 首新增，7 个空白、伴奏或错配条目暂不生成歌词页。
- 原有 160 首的数据保持不变；新增正文延续日文在左、简体中文在右、平假名 ruby 的排版。
- 去除时间戳、制作名单、翻译署名、作者自序、嵌入的标题和结束标记。缺译行保留原文，不编造来源译文。
- 纠正目录中的《何なw》为《何なんw》，使目录和正文正确对应。

| 艺人                     | 新增歌词 |
| ------------------------ | -------: |
| 藤井風                   |       60 |
| ヨルシカ                 |        6 |
| RADWIMPS                 |      194 |
| サカナクション           |      133 |
| Mrs. GREEN APPLE         |      133 |
| back number              |      120 |
| あいみょん               |       96 |
| Orangestar               |       48 |
| n-buna                   |       26 |
| ずっと真夜中でいいのに。 |        5 |

## 段落处理

297 首依据带 Aメロ、Bメロ、サビ、Cメロ等标记的曲谱对齐；385 首使用可核对的歌词段落和完整重复句组；110 首针对原文分句、重复副歌、念白、英文翻唱或采样循环逐首调整；另有 29 个版本通过相同歌词与基础版本对齐。

这些是核对方法，不代表所有歌曲都有官方曲式分析。曲谱中的同一段落内部小节不单独增加留白；连续歌词、完整副歌和尾声分别处理。念白和重复采样不强套主歌—预副歌—副歌模板。页面正文只显示歌词和段落留白。

txt 中有 33 处注明特别版本回退到原版歌词。本次保留供稿内容，不将这种回退视为 live、remix 与原版逐句、逐段完全相同的证明。

参考资料包括：

- [コード進行メモ倉庫](https://music-chord.com/)的逐曲段落标记，例如[《花》](https://music-chord.com/songs/花-藤井風/)和[《道徳と皿》](https://music-chord.com/songs/道徳と皿-Mrs._GREEN_APPLE/)。
- [大阪音楽大学论文](https://daion.repo.nii.ac.jp/record/2000337/files/63_26.pdf)对藤井風《花》的形式分析。
- [UtaTen](https://utaten.com/)的日文分段、上下文读音和版本资料；VOCALOID 作品同时检查本名与 feat. 演唱者名下的记录。
- [歌ネット](https://www.uta-net.com/)和官方发行资料用于核对歌曲身份。
- 歌名优先采用网易云音乐返回的中文标题字段；无该字段时核对标题含义，保留不能可靠释义的专名。

## 未生成正文的条目

| 艺人           | 歌曲                  | 原因                         |
| -------------- | --------------------- | ---------------------------- |
| RADWIMPS       | 三葉の通学            | 文件中误配《スパークル》歌词 |
| RADWIMPS       | 着席                  | 文件中误配《me me she》歌词  |
| RADWIMPS       | 夕霧                  | 文件中误配《me me she》歌词  |
| RADWIMPS       | 正解 (Instrumental)   | 纯伴奏版本                   |
| RADWIMPS       | 正解 (合唱ピアノ伴奏) | 钢琴伴奏版本                 |
| サカナクション | montage               | 文件中误配《Aoi》歌词        |
| back number    | こぼれ落ちて          | 文件中的正文为空             |

这些歌曲仍保留在目录中，按无歌词歌曲显示。错配判断参考[《me me she》歌词](https://www.uta-net.com/song/49383/)及[山口一郎对《montage》的说明](https://www.tfm.co.jp/lock/sakana/onair/120910/)。

## 2026-11-20 全库复校

全库扫描覆盖 10 位艺人、981 首。修订涉及 221 首，本次构建对应 39,696 行和 8,482 个歌词段。检查了资料错配、段落边界、中文缺译或错行、日文字形和 ruby 的读音与覆盖范围。

| 艺人                     | 歌词页 | 有修订 |
| ------------------------ | -----: | -----: |
| あいみょん               |     96 |     36 |
| back number              |    120 |     31 |
| 藤井 風                  |     60 |     13 |
| Mrs. GREEN APPLE         |    133 |     17 |
| n-buna                   |     36 |      6 |
| Orangestar               |     54 |     10 |
| RADWIMPS                 |    194 |     77 |
| サカナクション           |    133 |     16 |
| ヨルシカ                 |     82 |      5 |
| ずっと真夜中でいいのに。 |     73 |     10 |

初筛中有 841 首能与已找到的 UtaTen 正文对齐，有 371 首能与公开曲谱对齐到可比较的段落。初筛相似度用于找出差异。已对齐的材料仍可能省略衬词、使用不同写法或引用原版歌词，实际版本和具体唱法需要单独确认。词典提供疑似错读的候选，方言、当て字和特殊唱法结合曲目上下文处理。

- 《何なんw》校正首行冈山方言的写法，连起首段主歌，并重译错位的中文。[藤井風官方网站](https://fujiikaze.com/music/nan-nan/?lyricsid=1&mode=lyrics) · [曲谱与时间点](https://music-chord.com/songs/%E4%BD%95%E3%81%AA%E3%82%93w-%E8%97%A4%E4%BA%95%E9%A2%A8/)
- 《セツナレンサ》在第二轮主歌起唱处另起一段。《REVERSE》在桥段第二轮起唱处另起一段。[《セツナレンサ》曲谱](https://music-chord.com/songs/%E3%82%BB%E3%83%84%E3%83%8A%E3%83%AC%E3%83%B3%E3%82%B5-RADWIMPS/) · [《REVERSE》曲谱](https://music-chord.com/songs/REVERSE-Mrs._GREEN_APPLE/)
- 《叫べ》《あいまい》《或るひと夏の追憶》补上大段缺译，《ざらめ》《エンディング》《光の街》等重排错位译文。补译类型为根据供稿原文做的本站译文。[《叫べ》日文校对来源](https://www.uta-net.com/song/77066/)
- 《25コ目の染色体》《me me she》等校正数字词组的注音范围。旧式汉字注音与混合表记都可渲染为 ruby，排版保留原词的空格。[《25コ目の染色体》日文校对来源](https://www.uta-net.com/song/35439/)
- 《グランドエスケープ》的电影剪辑版按对应发行资料和歌词校正词序、分段和译文。[电影原声发行资料](https://radwimps.jp/music/10439/) · [电影剪辑版歌词](https://utaten.com/lyric/ma19071604/)
- 《クリームで会いにいけますか》原版已有双语数据，本次补齐单曲目录入口。[发行公告](https://zutomayo.net/news/509/)

### 仍需核实

- 《前前前世》的两个版本有读音出处冲突。各版本的缺段及重复唱句见下方再次复核的结果。[《前前前世》movie ver.](https://utaten.com/lyric/ya16072701/) · [original ver.](https://utaten.com/lyric/sa16112813/)
- 《スロイド》按重复唱句和句意调整段落，精确曲式仍需与对应录音核对。[发行资料](https://yorushika.com/discography/detail/11/) · [录音](https://www.youtube.com/watch?v=XB8DvNn_aag)
- 还有 70 行右栏为空，主要是无词衬唱和语气声。中文语义和特殊唱法已针对发现的疑点复核，其余内容仍待逐行人工确认。

<details>
<summary>自动对照阶段缺少可对齐的正文或曲谱候选（128 首）</summary>

- **back number**　《reunion》
- **藤井 風**　《Alfie》、《Back Stabbers》、《Be Alright》、《Circles》、《Close to you》、《Comets＋Gold》、《Don't Let Me Be Misunderstood》、《Eh, Eh》、《Good As Hell》、《Hot Stuff》、《Just the Two of Us》、《My Eyes Adored You》、《No Tears Left To Cry》、《Overprotected》、《Shake It Off》、《Shape Of You》、《Sorry》、《Stronger Than Me》、《Sunny》、《Teenage Dream》、《Time After Time》、《Weak》、《へでもねーよ (LASA edit)》、《キリがないから》、《特にない》
- **Mrs. GREEN APPLE**　《WHOO WHOO WHOO》、《あなたに》
- **n-buna**　《かぐや》、《ずっと空を見ていた》、《それでもいいよ。》、《また雨が降ったら》、《カーテンコールが止む前に》、《スロイド》、《セロ弾き群青》、《ハイカラ色の》、《ルラ》、《一人きりロックショー》、《七月、影法師、藍色、ロッカー》、《三月と狼少年》、《初恋》、《劇場愛歌》、《夜に染まるまで》、《歌う睡蓮》、《泣いた振りをした》、《無人駅》、《白ゆき》、《着火、カウントダウン》、《花と水飴、最終電車》
- **Orangestar**　《CITRUS》、《Lingering Fireworks》、《MOON-VINE》、《MOON-VINE (ASH ver.)》、《RIP》、《White Landscape》、《からっぽの街月夜の下》、《サンダルリープ》、《或るひと夏の追憶》、《新世界LIVE》
- **RADWIMPS**　《4645》、《Tummy》、《「ぼく」と「僕」》、《あいラブユー》、《うぃんぷす学園休み時間》、《おとぎ》、《なんちって》、《ふたたびの、雨》、《へっくしゅん》、《アンチクローン》、《イーディーピー ～飛んで火に入る夏の君～》、《グーの音》、《シリメツレツ》、《ノットビコーズ》、《バグッバイ》、《人生出会い》、《傘拍子》、《嫌ん》、《愛にできることはまだあるかい (Movie edit)》、《愛へ》、《祈跡-in album version-》、《自暴自棄自己中心的(思春期)自己依存症の少年》、《賜物 (Orchestra Version)》、《雨音子》、《風たちの声》
- **サカナクション**　《Ame(A)》、《Ame(B)》、《Ame(B) -SAKANATRIBE × ATM version-》、《Aoi》、《INORI》、《multiple exposure》、《years (Floating Points Remix)》、《なんてったって春》、《アドベンチャー -Rearrange 2023-》、《アルデバラン -Rearrange 2023-》、《インナーワールド》、《インナーワールド -Rearrange 2023-》、《エンドレス -Rearrange 2023-》、《グッドバイ (NEXT WORLD REMIX)》、《サンプル -Rearrange 2023-》、《ショック！》、《シーラカンスと僕 -Rearrange 2020-》、《ストラクチャー》、《セプテンバー -札幌 version-》、《セプテンバー -東京 version-》、《ナイトフィッシングイズグッド (Iw_Remix)》、《ナイロンの糸 (Kuniyuki Takahashi Long Dub Version)》、《ナイロンの糸 -Rearrange 2019-》、《ホーリーダンス -Rearrange 2023-》、《ボイル -Rearrange 2023-》、《ミュージック (Ej_Remix)》、《モノクロトウキョー》、《ユリイカ (Shotaro Aoyama Remix)》、《ユリイカ -Rearrange 2021-》、《ライトダンス》、《ルーキー》、《ルーキー (Takkyu Ishino Remix)》、《ワード》、《三日月サンセット (FPM EVERLUST MIX)》、《三日月サンセット -Rearrange 2020-》、《夜の東側 -Rearrange 2020-》、《忘れられないの -Rearrange 2020-》、《新宝島 -Rearrange 2020-》、《映画 (AOKI takamasa Remix)》、《映画 (コンテ 2012/11/16 17:24)》、《潮》、《白波トップウォーター -Rearrange 2020-》、《茶柱 -Rearrange 2019-》、《蓮の花 -single version-》

</details>

<details>
<summary>供稿注明沿用原版歌词的条目（34 个）</summary>

- **RADWIMPS**　《祈跡-in album version-》、《DADA (dadadadaVer.)》、《携帯電話 (Cat Ver.)》、《前前前世 (original ver.)》、《グランドエスケープ (Movie edit) feat. 三浦透子》、《グランドエスケープ feat. 三浦透子》、《白日 (10 years ver.)》、《うたかた歌 (feat. 菅田将暉)》、《正解 (合唱ピアノ伴奏)》
- **サカナクション**　《セントレイ (シンシロ ver.)》、《アイデンティティ (Ks_Remix)》、《サンプル (cosmic version)》、《陽炎 -movie version-》、《目が明く藍色 (agraph remix)》
- **Mrs. GREEN APPLE**　《はじまり feat. キヨサク from MONGOL800》、《ブルーアンビエンス (feat. asmi)》、《Folktale (The White Lounge Version)》、《君を知らない (The White Lounge Version)》、《ダンスホール (The White Lounge Version)》、《ツキマシテハ (The White Lounge Version)》、《Coffee (The White Lounge Version)》、《ニュー・マイ・ノーマル (The White Lounge Version)》、《PARTY (The White Lounge Version)》、《春愁 (The White Lounge Version)》、《Just a Friend (The White Lounge Version)》、《Attitude (The White Lounge Version)》、《Feeling (The White Lounge Version)》、《ケセラセラ (The White Lounge Version)》、《Soranji (The White Lounge Version)》、《フロリジナル (The White Lounge Version)》、《道徳と皿 ～2025 ver.～》、《Log (feat. 坂口有望)》、《点描の唄 (feat. 井上苑子)》
- **Orangestar**　《ノクティルーカ (feat. 夏背 & 遼遼)》

</details>

## 2026-11-20 再次复核

逐曲检查了 10 位艺人的 981 个歌词页和 1,175 个目录条目。供稿的 829 个曲目均已对上目录或原有记录，其中 7 个条目仍无歌词页。额外修订了 37 首的歌词数据，以及《夕凪、某、花惑い》的中文标题和目录中的三个错字。复核后共 39,703 行、8,495 段。

公开歌词和曲谱对照覆盖 917 首，计入的是归一化后文本相似度达到 82% 的候选。结合供稿，每个歌词页都找到了达到此阈值的文本候选。另按顺序对照了藤井風四首歌的官方正文。《キリがないから》《へでもねーよ (LASA edit)》《花》覆盖官方正文，《特にない》有四处假名与汉字的表记差异。供稿另含衬唱和重复句。[首张专辑官方歌词](https://fujiikaze.com/music/help-ever-hurt-never/) · [《へでもねーよ (LASA edit)》官方歌词](https://fujiikaze.com/music/love_all_serve_all_limited/?lyricsid=3&mode=lyrics) · [《花》官方歌词](https://fujiikaze.com/music/hana/?lyricsid=1&mode=lyrics)

- 《グランドエスケープ》三浦透子完整版补回副歌后的 7 行重复唱句。电影剪辑版和《FOREVER DAZE》版分别核对曲序和原文。三个版本同步修正数字注音与重力意象的中文译文。[JOYSOUND 三浦透子完整版](https://www.joysound.com/web/search/song/805314) · [AWA 三浦透子完整版](https://s.awa.fm/track/a856fe021dc5ce076b49) · [电影剪辑版](https://utaten.com/lyric/ma19071604/) · [《FOREVER DAZE》官方歌词](https://radwimps.jp/foreverdaze/)
- 《前前前世》专辑版的供稿缺三行独有桥段。歌曲页已标出缺段位置，并附专辑版完整原文链接。[电影版](https://www.uta-net.com/song/211495/) · [专辑版](https://www.uta-net.com/song/221993/) · [专辑版发行说明](https://radwimps.jp/news/8813/)
- 《初恋》补记合作演唱及 n-buna 的作曲与编曲署名。《何なんw》修复精选集内的错误目录项。《憎まれっ子世に憚る》《廃墟の温泉街》改回发行表记。[《初恋》发行说明](https://yorushika.com/news/detail/11310) · [藤井風精选集](https://fujiikaze.com/music/best_of_fujii_kaze_2020-2024/) · [あいみょん专辑](https://www.aimyong.net/discography/detail/3/) · [《すずめの戸締まり》原声](https://radwimps.jp/music/13570/)
- 根据曲谱校正《そっけない》《VIP》《アルクアラウンド》等 13 首的主歌或副歌起点。复核了《忘れられないの》的漏译、《ソクラティックラブ》和《庶幾の唄》的英文唱段、《ミラーチューン》和《アンチモン》的英文空格。[《VIP》曲谱](https://music-chord.com/songs/VIP-Mrs._GREEN_APPLE/) · [《庶幾の唄》曲谱](https://music-chord.com/songs/%E5%BA%B6%E5%B9%BE%E3%81%AE%E5%94%84-Mrs._GREEN_APPLE/) · [《アンチモン》授权歌词](https://s.awa.fm/track/e4bd26387dbacd26c858)
- 原合集里的 7 个缺正文或错配条目仍留在目录。《こぼれ落ちて》已有公开日文原词，供稿中缺双语正文。[back number 官方歌词](https://backnumber.info/lyrics/detail/4/) · [RADWIMPS 伴奏版本说明](https://radwimps.jp/radwimps_staff/%E6%AD%A3%E8%A7%A3/)

相似度用于找出需要细看之处。外部正文、曲谱和录音片段能确认的范围各有不同。仍有 68 行右栏为空，复看后主要为语气声或无词衬唱。词义、逐字唱法和现场或混音版本的全曲结构仍有待人工确认的条目，包括《スロイド》分段以及下列缺少充分外部文本或曲谱对照的曲目。

<details>
<summary>公开歌词或曲谱未达到文本对照阈值的曲目（64 首，含上述四首已核对官方正文的藤井風歌曲）</summary>

- **藤井 風**　《キリがないから》、《特にない》、《Stronger Than Me》、《Time After Time》、《へでもねーよ (LASA edit)》、《Sunny》、《Hot Stuff》、《Sorry》、《Weak》、《Overprotected》、《Teenage Dream》、《花》
- **Mrs. GREEN APPLE**　《WanteD! WanteD!》、《WHOO WHOO WHOO》、《あなたに》
- **Orangestar**　《CITRUS》、《Lingering Fireworks》、《新世界LIVE》、《White Landscape》
- **RADWIMPS**　《4645》、《人生出会い》、《自暴自棄自己中心的(思春期)自己依存症の少年》、《「ぼく」と「僕」》、《嫌ん》、《愛へ》、《あいラブユー》、《愛し（かなし）～明くる明け～》、《なんちって》、《ノットビコーズ》、《うぃんぷす学園休み時間》、《シリメツレツ》、《祈跡-in album version-》、《イーディーピー ～飛んで火に入る夏の君～》、《おとぎ》、《へっくしゅん》、《雨音子》、《Tummy》、《愛にできることはまだあるかい (Movie edit)》、《ふたたびの、雨》、《賜物 (Orchestra Version)》、《アンチクローン》、《グーの音》
- **サカナクション**　《潮》、《ルーキー》、《INORI》、《ストラクチャー》、《映画 (コンテ 2012/11/16 17:24)》、《Ame(B) -SAKANATRIBE × ATM version-》、《ルーキー (Takkyu Ishino Remix)》、《三日月サンセット (FPM EVERLUST MIX)》、《インナーワールド -Rearrange 2023-》、《新宝島 -Rearrange 2020-》、《アルデバラン -Rearrange 2023-》、《夜の東側 -Rearrange 2020-》、《ホーリーダンス -Rearrange 2023-》、《ユリイカ -Rearrange 2021-》、《アドベンチャー -Rearrange 2023-》、《エンドレス -Rearrange 2023-》、《茶柱 -Rearrange 2019-》、《サンプル -Rearrange 2023-》、《三日月サンセット -Rearrange 2020-》、《ナイロンの糸 -Rearrange 2019-》、《白波トップウォーター -Rearrange 2020-》、《ナイロンの糸 (Kuniyuki Takahashi Long Dub Version)》

</details>
