export type CategoryType = 'all' | 'general_word' | 'tech_word' | 'idiom' | 'grammar';

export interface LearningItem {
  id: string;
  category: 'general_word' | 'tech_word' | 'idiom' | 'grammar';
  term: string; // 英語（単語・熟語・文法名）
  pos?: string; // 品詞 (n., v., adj., adv., n. phr. など)
  meaning: string; // 意味・ニュアンス
  usage?: string; // 本文での使われ方・文脈
  structure?: string; // 文法構文の構造
  explanation?: string; // 文法解説
  etymology: string; // 語源・言葉の成り立ち（例文の代わりに記憶定着に役立てる）
}

export const CATEGORIES: { id: CategoryType; label: string; icon: string; count: number }[] = [
  { id: 'all', label: 'すべて', icon: 'Layers', count: 72 },
  { id: 'general_word', label: '重要語彙', icon: 'BookOpen', count: 39 },
  { id: 'tech_word', label: 'AI・技術用語', icon: 'Cpu', count: 13 },
  { id: 'idiom', label: '熟語・句動詞', icon: 'Sparkles', count: 20 },
  { id: 'grammar', label: '英文法・構文', icon: 'Compass', count: 10 },
];

export const LEARNING_ITEMS: LearningItem[] = [
  // 1. 一般・学術・論説重要語彙 (39語)
  {
    id: 'gw-1',
    category: 'general_word',
    term: 'containment',
    pos: 'n.',
    meaning: '封じ込め、抑制、格納',
    usage: '製品全体におけるClaudeの安全な制御',
    etymology: 'con-（共に、完全に）+ tain（ラテン語 tenere: 保つ・掴む）+ -ment（名詞語尾）→「枠の中にすべて掴んで留めておくこと」'
  },
  {
    id: 'gw-2',
    category: 'general_word',
    term: 'blast radius',
    pos: 'n. phr.',
    meaning: '被害想定範囲、影響範囲（元は爆発半径）',
    usage: 'エージェントの誤動作・攻撃時の最大被害規模',
    etymology: 'blast（古英語 blæst: 突風・吹き荒れる爆風）+ radius（ラテン語: 車輪の輻/スポーク・光線・半径）→「爆風が届く円形の被害エリア」'
  },
  {
    id: 'gw-3',
    category: 'general_word',
    term: 'cap',
    pos: 'v.',
    meaning: '上限を定める、抑える',
    usage: '潜在的被害範囲を制限する',
    etymology: '後期ラテン語 cappa（頭を覆うもの・帽子/ケープ）→「上から帽子や蓋を被せて、それ以上大きくならないよう抑える」'
  },
  {
    id: 'gw-4',
    category: 'general_word',
    term: 'sufficient',
    pos: 'adj.',
    meaning: '十分な',
    usage: '〜をダウンさせるのに十分な権限',
    etymology: 'sub-（下から、手元に）+ facere（ラテン語: 作る、成す）→「下から支えて要求水準を満たすだけの量がある」'
  },
  {
    id: 'gw-5',
    category: 'general_word',
    term: 'deployment',
    pos: 'n.',
    meaning: '本番配備、導入、展開',
    usage: 'モデルや製品の本番運用',
    etymology: 'dis-（分離・解除）+ plicare（ラテン語: 折る、畳む）→「折りたたまれていた軍やシステムを解き放って前線に広げること」'
  },
  {
    id: 'gw-6',
    category: 'general_word',
    term: 'safeguard',
    pos: 'n.',
    meaning: '安全対策、保護措置',
    usage: 'モデルの訓練・運用における防御策',
    etymology: 'safe（安全な: ラテン語 salvus 傷のない）+ guard（見張る、防ぐ）→「安全な状態を見張り維持するための盾」'
  },
  {
    id: 'gw-7',
    category: 'general_word',
    term: 'autonomous',
    pos: 'adj.',
    meaning: '自律的な、自立型の',
    usage: '自律型AIエージェント',
    etymology: 'auto-（ギリシャ語: 自身の、自らの）+ nomos（法、規則）→「外部の命令ではなく、自分自身の法・規範に従って動く」'
  },
  {
    id: 'gw-8',
    category: 'general_word',
    term: 'deem',
    pos: 'v.',
    meaning: '（〜だと）見なす、判断する',
    usage: '公開するには危険すぎると判断された',
    etymology: '古英語 dēman（裁く、判決を下す）。doom（運命、判決）と同根語で、熟慮の末に「〜だと見なす・判定する」という意味'
  },
  {
    id: 'gw-9',
    category: 'general_word',
    term: 'fallible',
    pos: 'adj.',
    meaning: '誤りを犯しやすい、不完全な',
    usage: '人間による確認作業はミスが起きやすい',
    etymology: 'fallere（ラテン語: 欺く、誤る、fail/faultの語源）+ -ible（可能・性質）→「つまずいたり騙されたりしやすい」'
  },
  {
    id: 'gw-10',
    category: 'general_word',
    term: 'telemetry',
    pos: 'n.',
    meaning: '利用状況データ収集、遠隔測定・ログ',
    usage: 'ユーザーの承認行動ログ',
    etymology: 'tele-（ギリシャ語: 遠く離れた: telephone, televisionと同根）+ -metry（測定術: metron/測る）→「遠く離れた場所の状態を自動測定・収集すること」'
  },
  {
    id: 'gw-11',
    category: 'general_word',
    term: 'diligent',
    pos: 'adj.',
    meaning: '勤勉な、入念な、配慮の行き届いた',
    usage: '承認作業への注意深さ',
    etymology: 'dis-（選り分けて）+ legere（選ぶ、好む）→「価値あるものを丁寧に選別して大事にするような、注意深く熱心な姿勢」'
  },
  {
    id: 'gw-12',
    category: 'general_word',
    term: 'fatigue',
    pos: 'n.',
    meaning: '疲労、消耗',
    usage: 'approval fatigue（承認疲れ・形骸化）',
    etymology: 'ラテン語 fatigare（疲れ果てさせる）。fatis（割れ目・息切れ）に由来し、過度の負担で限界に達した状態'
  },
  {
    id: 'gw-13',
    category: 'general_word',
    term: 'probabilistic',
    pos: 'adj.',
    meaning: '確率論的な（↔ deterministic: 決定論的な）',
    usage: 'モデルの出力は確率的で完全ではない',
    etymology: 'pro-（前に）+ probare（ラテン語: 試す、証明する、probeと同根）→「おそらく確からしい（probable）根拠に基づく」'
  },
  {
    id: 'gw-14',
    category: 'general_word',
    term: 'enforce',
    pos: 'v.',
    meaning: '施行する、強制・適用する',
    usage: 'アクセス境界を厳格に適用する',
    etymology: 'en-（中に加える、〜の状態にする）+ force（力、ラテン語 fortis/強い）→「権威や力を込めてルールを確実に効かせる」'
  },
  {
    id: 'gw-15',
    category: 'general_word',
    term: 'egress',
    pos: 'n.',
    meaning: '送信、外部への出口（↔ ingress）',
    usage: '外部通信・送信の制御（egress controls）',
    etymology: 'e- / ex-（外へ）+ gradi（ラテン語: 歩む、進む: grade/progressと同根）→「内側から外へと歩み出ること・外部送信」'
  },
  {
    id: 'gw-16',
    category: 'general_word',
    term: 'devote',
    pos: 'v.',
    meaning: '（時間・労力を）注ぐ、捧げる',
    usage: '最も工数を注ぎ込んできた領域',
    etymology: 'de-（離れて、徹底的に）+ vovere（ラテン語: 誓う、vowと同根）→「誓いを立てて神や対象に一身を捧げる・集中投下する」'
  },
  {
    id: 'gw-17',
    category: 'general_word',
    term: 'misuse',
    pos: 'n. / v.',
    meaning: '悪用、誤用',
    usage: 'ユーザーによる悪用や不注意な操作',
    etymology: 'mis-（誤って、悪く）+ use（使う）→「本来の目的やルールから外れた間違った使い方」'
  },
  {
    id: 'gw-18',
    category: 'general_word',
    term: 'misbehavior',
    pos: 'n.',
    meaning: '逸脱動作、不正動作',
    usage: 'モデルが意図しない問題行動を起こすこと',
    etymology: 'mis-（不正な）+ be-（強意）+ have（持っている、身を処する）→「あるべき規範から外れた不適切な立ち振る舞い」'
  },
  {
    id: 'gw-19',
    category: 'general_word',
    term: 'aligned',
    pos: 'adj.',
    meaning: '（AIが人間の意図や価値観に）沿った、整合した',
    usage: 'アライメント評価で適合度が高まっている',
    etymology: 'a- / ad-（〜に向かって）+ ligne（フランス語: 線、line）→「まっすぐ同じ直線・基準の上に並べること」'
  },
  {
    id: 'gw-20',
    category: 'general_word',
    term: 'shrink',
    pos: 'v.',
    meaning: '縮小する、減少する',
    usage: 'リスクが必ずしも減るとは限らない',
    etymology: 'ゲルマン祖語 skrink-（しわが寄る、縮む）。物理的な収縮から数値・リスクの減少まで幅広く用いられる'
  },
  {
    id: 'gw-21',
    category: 'general_word',
    term: 'exfiltrate',
    pos: 'v.',
    meaning: '（機密情報などを）不正持ち出しする',
    usage: '外部へ認証情報を盗み出す',
    etymology: 'ex-（外へ）+ filtrate（浸透する、ろ過する: filterと同根）→「防壁の隙間からこっそり外へしみ出させる・秘密裏に持ち出す」'
  },
  {
    id: 'gw-22',
    category: 'general_word',
    term: 'perimeter',
    pos: 'n.',
    meaning: '防御境界線、周囲',
    usage: '厳格な境界線を敷く',
    etymology: 'peri-（ギリシャ語: 周囲をまわる）+ metron（測る）→「周囲をぐるりと一周測った輪郭・外周の防衛境界線」'
  },
  {
    id: 'gw-23',
    category: 'general_word',
    term: 'unattended',
    pos: 'adj.',
    meaning: '監視なしの、無人の',
    usage: '人間の常時承認なしで実行する',
    etymology: 'un-（否定）+ at-（〜へ）+ tendere（ラテン語: 意識を伸ばす、注意を払う）→「誰の意識・視線も向けられていない状態」'
  },
  {
    id: 'gw-24',
    category: 'general_word',
    term: 'susceptibility',
    pos: 'n.',
    meaning: '影響を受けやすさ、脆弱性',
    usage: 'プロンプトインジェクションへの耐性度',
    etymology: 'sub-（下から）+ capere（ラテン語: 掴む、受け取る）+ -ibility →「下からまともに刺激や攻撃を受け止めやすい性質」'
  },
  {
    id: 'gw-25',
    category: 'general_word',
    term: 'overeager',
    pos: 'adj.',
    meaning: '勇み足の、熱心すぎる',
    usage: '先走りすぎたエージェントの挙動',
    etymology: 'over-（過剰に）+ eager（ラテン語 acer: 鋭利な、熱心な）→「やる気が鋭すぎて空回りし、先走ってしまう」'
  },
  {
    id: 'gw-26',
    category: 'general_word',
    term: 'ephemeral',
    pos: 'adj.',
    meaning: '一時的な、セッション限りの',
    usage: 'セッション終了時に消去されるファイルシステム',
    etymology: 'epi-（〜の間だけ）+ hemera（ギリシャ語: 一日）→「カゲロウのようにたった一日限りの儚い命・一時的な環境」'
  },
  {
    id: 'gw-27',
    category: 'general_word',
    term: 'adversary',
    pos: 'n.',
    meaning: '敵対者、サイバー攻撃者',
    usage: '豊富な資金・スキルを持つ攻撃者',
    etymology: 'ad-（〜に対して）+ vertere（ラテン語: 向きを変える、vers-）→「自分と真っ向から反対を向いて立ち塞がる相手」'
  },
  {
    id: 'gw-28',
    category: 'general_word',
    term: 'consequential',
    pos: 'adj.',
    meaning: '重大な結果を招く、深刻な',
    usage: '最も影響の大きかったセキュリティインシデント',
    etymology: 'con-（共に）+ sequi（ラテン語: 続く、従う: sequenceと同根）→「それに伴って極めて重い結果がついて回る」'
  },
  {
    id: 'gw-29',
    category: 'general_word',
    term: 'tractable',
    pos: 'adj.',
    meaning: '扱いやすい、現実的に解決可能な',
    usage: '技術者相手だからこそ成立する現実的解決策',
    etymology: 'tractare（ラテン語: 引く、引っ張って操る: tractorと同根）+ -able →「手元で手綱を引いてコントロールできる・解決可能」'
  },
  {
    id: 'gw-30',
    category: 'general_word',
    term: 'mitigate',
    pos: 'v.',
    meaning: '軽減する、緩和する',
    usage: '不注意な承認を緩和・抑制する',
    etymology: 'mitis（ラテン語: 穏やかな、柔らかい）+ agere（動かす、導く）→「固く険しい事態を柔らかく和らげる」'
  },
  {
    id: 'gw-31',
    category: 'general_word',
    term: 'incautious',
    pos: 'adj.',
    meaning: '不注意な、軽率な',
    usage: 'よく確認せずに行う安易な承認',
    etymology: 'in-（否定）+ cautio（用心、警戒: cautionの語源）→「警戒心を解いてしまい、不用意で軽率な」'
  },
  {
    id: 'gw-32',
    category: 'general_word',
    term: 'auditable',
    pos: 'adj.',
    meaning: '監査・検証可能な',
    usage: 'コードが公開され第三者が検証できる',
    etymology: 'audire（ラテン語: 聴く、audioと同根）+ -able →「元は公聴会で証言を耳で聴いて確かめたことから、第三者が監査・検証できること」'
  },
  {
    id: 'gw-33',
    category: 'general_word',
    term: 'drift',
    pos: 'n.',
    meaning: '（意図からの）逸脱、ズレ',
    usage: 'エージェントの挙動が目標からずれること',
    etymology: 'drive（強く押す、駆り立てる）から派生。風や潮の流れに押し流され、元の進行方向から徐々にズレていく現象'
  },
  {
    id: 'gw-34',
    category: 'general_word',
    term: 'consent',
    pos: 'v. / n.',
    meaning: '同意する / 承認、同意',
    usage: 'ユーザーの同意を得る前の実行',
    etymology: 'con-（共に）+ sentire（ラテン語: 感じる、senseと同根）→「同じ感覚・思いを共有して認める」'
  },
  {
    id: 'gw-35',
    category: 'general_word',
    term: 'defer',
    pos: 'v.',
    meaning: '延期する、後回しにする',
    usage: 'ユーザー承認まで処理を遅延させる',
    etymology: 'de-（離れて、脇へ）+ ferre（ラテン語: 運ぶ）→「決断や行動を脇へ運び置いて、あとへ先延ばしにする」'
  },
  {
    id: 'gw-36',
    category: 'general_word',
    term: 'implicitly',
    pos: 'adv.',
    meaning: '暗黙のうちに、無条件に',
    usage: 'ローカルだからと暗黙に信用してはならない',
    etymology: 'im- / in-（内側に）+ plicare（ラテン語: 折りたたむ）→「外に明文化せず、内側に折りたたんで包み隠しているさま」'
  },
  {
    id: 'gw-37',
    category: 'general_word',
    term: 'anomalous',
    pos: 'adj.',
    meaning: '異常な、変則的な',
    usage: '判定器が検知すべき不審な兆候',
    etymology: 'an-（否定）+ homalos（ギリシャ語: 均等な、平坦な: homeo-と同根）→「いつもと同じ均一な状態ではなく、デコボコと狂っている」'
  },
  {
    id: 'gw-38',
    category: 'general_word',
    term: 'provenance',
    pos: 'n.',
    meaning: '出所、来歴、真正性',
    usage: 'リクエストの発信元が正当かどうかの出所',
    etymology: 'pro-（前へ）+ venire（ラテン語: 来る）→「前をたどるとどこからやって来たのかという起源・出所」'
  },
  {
    id: 'gw-39',
    category: 'general_word',
    term: 'opaque',
    pos: 'adj.',
    meaning: '不透明な、内部を窺い知れない',
    usage: '外部監視ツールから中身が見えないVM',
    etymology: 'ラテン語 opacus（日陰の、暗い、光を通さない）→「光が通らず向こう側や内部の様子が一切見えないこと」'
  },

  // 2. AI・セキュリティ技術専門用語 (13語)
  {
    id: 'tw-1',
    category: 'tech_word',
    term: 'human-in-the-loop (HITL)',
    pos: 'n.',
    meaning: '人間がプロセスの途中で介在・承認する仕組み',
    usage: 'エージェントの危険な操作を人間が確認して承認するアーキテクチャ',
    etymology: 'human（人間）+ in the loop（一連の制御ループの内側に加わっていること）→ 自動制御の輪の中に人間が介在する構造'
  },
  {
    id: 'tw-2',
    category: 'tech_word',
    term: 'sandbox',
    pos: 'n.',
    meaning: '外部に影響を与えないよう隔離された安全な実行環境',
    usage: 'コード実行やファイルアクセスを閉じ込める隔離領域',
    etymology: 'sand（砂）+ box（箱）→「子供が砂場の中でいくら砂を撒き散らしても周囲の部屋を汚さない」という比喩から'
  },
  {
    id: 'tw-3',
    category: 'tech_word',
    term: 'prompt injection',
    pos: 'n.',
    meaning: '悪意あるプロンプトを入力してモデルの制限を突破・乗っ取る攻撃',
    usage: '外部データやWebページに仕込まれた指示によるAIのハイジャック',
    etymology: 'SQL injectionの派生。in-（中へ）+ jacere（ラテン語: 投げる）→ 本来の指示文の中に悪意の指示を「注射・注入」してねじ込む攻撃'
  },
  {
    id: 'tw-4',
    category: 'tech_word',
    term: 'runtime',
    pos: 'n.',
    meaning: 'プログラムが動作する実行環境基盤',
    usage: 'コンテナやエージェントコードを実行する基盤層',
    etymology: 'run（走る、実行する）+ time（時・環境）→ コンパイル時（compile time）の対義語で、実際に動いている期間とその基盤'
  },
  {
    id: 'tw-5',
    category: 'tech_word',
    term: 'orchestration',
    pos: 'n.',
    meaning: '複数システムやコンテナ群を自動統合・調整する仕組み',
    usage: 'エージェントタスク用の仮想環境やツールの自動プロビジョニング',
    etymology: 'orchestra（オーケストラ管弦楽団）から。指揮者が多くの楽器を統率して1つの曲を奏でるように、多数のサーバーやVMを協調させる'
  },
  {
    id: 'tw-6',
    category: 'tech_word',
    term: 'classifier / probe',
    pos: 'n.',
    meaning: '入力や内部状態を監視・分類するための検出モデル・測定器',
    usage: 'プロンプトや出力の危険度をリアルタイムに検知する補助モデル',
    etymology: 'classify（等級・クラスに分ける）+ probe（ラテン語 probare/調べる: 内部に探針を刺して探る器具）'
  },
  {
    id: 'tw-7',
    category: 'tech_word',
    term: 'red teaming',
    pos: 'n.',
    meaning: '攻撃側の視点でシステムの弱点や脆弱性を検証する疑似攻撃演習',
    usage: '社内の専門チームがエージェントの防御網を突破しようと試みるテスト',
    etymology: '軍事演習で自軍を守備隊「青軍（Blue Team）」、敵の仮想敵国を「赤軍（Red Team）」と呼んだことに由来'
  },
  {
    id: 'tw-8',
    category: 'tech_word',
    term: 'MCP (Model Context Protocol)',
    pos: 'n.',
    meaning: 'モデルと各種データ・ツールをつなぐオープンプロトコル',
    usage: 'ClaudeがファイルシステムやGit、APIなどのツールと安全に連携する標準規格',
    etymology: 'Model（AIモデル）+ Context（文脈・情報）+ Protocol（規約）→ AIが外部ツールやデータソースの文脈を安全にやり取りする取り決め'
  },
  {
    id: 'tw-9',
    category: 'tech_word',
    term: 'payload',
    pos: 'n.',
    meaning: 'サイバー攻撃において実際に悪意ある処理を実行する本体データ',
    usage: 'インジェクション攻撃でシステムを侵害するコードやコマンド',
    etymology: 'pay（報酬、実入り）+ load（荷物）→ 航空宇宙・ロケットで燃料や機体以外の「実際に運ぶ有償の積載物・弾頭」を指す軍事用語がITに転用'
  },
  {
    id: 'tw-10',
    category: 'tech_word',
    term: 'canary string',
    pos: 'n.',
    meaning: '情報漏洩や不正侵入を検知するためにあらかじめ仕込んでおく特定の目印文字列',
    usage: 'エージェントが機密データを外部送信していないかを検知するトラップ',
    etymology: 'かつて炭鉱夫が有毒ガス（無色無臭）の発生を早く察知するために「カナリアの鳥籠」を持ち込んだ歴史的事実（炭鉱のカナリア）から'
  },
  {
    id: 'tw-11',
    category: 'tech_word',
    term: 'hypervisor',
    pos: 'n.',
    meaning: '仮想マシン（VM）を起動・制御するための基盤仮想化ソフトウェア',
    usage: 'セキュアな隔離境界を提供する仮想化レイヤー',
    etymology: 'hyper-（上位の、超えた）+ supervisor（監督者）→ OS（Supervisor）のさらに「上位でOSを監督・統括するもの」'
  },
  {
    id: 'tw-12',
    category: 'tech_word',
    term: 'EDR (Endpoint Detection and Response)',
    pos: 'n.',
    meaning: '端末の挙動を監視し脅威を検知・対処するセキュリティシステム',
    usage: 'VMやホスト端末での不審なプロセス実行やネットワーク接続の監視',
    etymology: 'Endpoint（末端のPCやサーバー）+ Detection（検知）+ Response（即座の隔離などの対処）'
  },
  {
    id: 'tw-13',
    category: 'tech_word',
    term: 'MITM (Man-in-the-Middle) proxy',
    pos: 'n.',
    meaning: '通信の間に割り込んで中継・検査・改変を行うプロキシ',
    usage: 'エージェントのアウトバウンドHTTPリクエストを傍受・検証する仕組み',
    etymology: 'Man in the Middle（中間者）。送信者と受信者の「真ん中に男が割り込む」攻撃手法を、防御側の通信検査に転用したもの'
  },

  // 3. 熟語・句動詞・コロケーション (20語)
  {
    id: 'id-1',
    category: 'idiom',
    term: 'reject out of hand',
    meaning: '即座に却下する、頭から拒絶する',
    usage: 'we\'d have rejected out of hand the idea...（以前なら即座に却下していた発想）',
    etymology: 'out of hand（手元からすぐに、考える間もなく手放して）→「検討のために手に持つことすらせずに、手元から払い落とす」イメージ'
  },
  {
    id: 'id-2',
    category: 'idiom',
    term: 'take down',
    meaning: '（サーバーやサービスを）停止させる、ダウンさせる',
    usage: 'sufficient to take down an internal Anthropic service',
    etymology: 'take（取る、引き倒す）+ down（下へ）→ ボクシングなどで相手をリングに倒すように、稼働中のサーバーを叩き落として停止させる'
  },
  {
    id: 'id-3',
    category: 'idiom',
    term: 'drive down',
    meaning: '（数値・確率・コストを）押し下げる',
    usage: 'Progress on safeguards has steadily driven down the first',
    etymology: 'drive（強い力で追いやる、走らせる）+ down（下へ）→ 意図的な強い力・取り組みによって、数値の針をぐいぐいと下方向へ押し込む'
  },
  {
    id: 'id-4',
    category: 'idiom',
    term: 'tip toward',
    meaning: '（バランスや天秤が）〜へ傾く',
    usage: 'the risk-reward calculation tips heavily toward adoption',
    etymology: 'tip（傾ける、ひっくり返す）+ toward（〜の方向へ）→ シーソーや天秤の重心が動いて、片方の側へとガクンと傾くこと'
  },
  {
    id: 'id-5',
    category: 'idiom',
    term: 'as long as ...',
    meaning: '〜である限りは（条件）',
    usage: 'as long as products can be made safe.',
    etymology: 'long（時間の長さ）。「その条件が続く時間の長さと同じ長さだけ、主節の事態も成り立つ」という平行関係を表す接続表現'
  },
  {
    id: 'id-6',
    category: 'idiom',
    term: 'hold up',
    meaning: '（負荷や検証に）耐える、持ちこたえる、有効であり続ける',
    usage: 'This article shares what\'s held up, what\'s broken...',
    etymology: 'hold（保持する）+ up（上向きに支えて）→ 上からの強い重圧や激しい風雪を受けても、下に潰れずに上に直立し続ける'
  },
  {
    id: 'id-7',
    category: 'idiom',
    term: 'along the way',
    meaning: 'その過程で、これまでに、道中で',
    usage: 'what we\'ve learned about agent security along the way.',
    etymology: 'along（〜に沿って）+ the way（道のり）→ ゴールを目指して歩んできたこれまでの道のりの途中で'
  },
  {
    id: 'id-8',
    category: 'idiom',
    term: 'route around',
    meaning: '（障害や制限を）迂回する、すり抜ける',
    usage: 'by routing around restrictions nobody thought to write down.',
    etymology: 'route（道筋を定める）+ around（障害物のまわりをぐるりと）→ 通行止めの壁にぶつかったときに、脇の抜け道を回って迂回する'
  },
  {
    id: 'id-9',
    category: 'idiom',
    term: 'put ... to work',
    meaning: '〜を活用する、稼働させる、役立てる',
    usage: 'capabilities that are sometimes put to work in unexpected ways.',
    etymology: 'put（配置する）+ to work（仕事・労働の状態へ）→ 眠っている能力やツールを実際の現場に送り込んで働かせる'
  },
  {
    id: 'id-10',
    category: 'idiom',
    term: 'stand alone',
    meaning: '単独で成り立つ、独立して機能する',
    usage: 'model layer will never be 100% effective, which is why it can\'t stand alone.',
    etymology: 'stand（立つ）+ alone（ひとりで）→ 他の支えや添え木なしに、自分ひとりの足だけで自立して倒れずにいること'
  },
  {
    id: 'id-11',
    category: 'idiom',
    term: 'pick up the slack',
    meaning: '不足分を補う、穴埋め・尻拭いをする',
    usage: 'the model layer has to pick up the slack',
    etymology: 'slack（緩んだロープ・たるみ）。船のロープのたるみ（slack）を手繰り寄せてピンと張る作業から「他者の不備や手落ちを補う」意味に発展'
  },
  {
    id: 'id-12',
    category: 'idiom',
    term: 'higher up the chain',
    meaning: '（プロセスの）より上位の段階で、上流で',
    usage: 'defenses can be added higher up the chain...',
    etymology: 'chain（一連の鎖・処理パイプライン）の higher up（より上の輪）。川の上流と同じく、末端に届く前の早い上流段階'
  },
  {
    id: 'id-13',
    category: 'idiom',
    term: 'come back to',
    meaning: '（後の文脈で）再び触れる、立ち戻る',
    usage: 'We\'ll come back to this later...',
    etymology: 'come（来る）+ back（元の場所へ）+ to（〜へ）→ 今の話題から一度離れたあと、後ほど再びその場所へと戻ってくる'
  },
  {
    id: 'id-14',
    category: 'idiom',
    term: 'go off track',
    meaning: '脱線する、意図から外れる',
    usage: 'supervise the agent only when it goes off track.',
    etymology: 'go（進む）+ off（外れて）+ track（レール、走路）→ 列車が本来敷かれたレールから車輪を踏み外して暴走するイメージ'
  },
  {
    id: 'id-15',
    category: 'idiom',
    term: 'in the first place',
    meaning: 'そもそも、初めから',
    usage: 'notice drift in the first place / keep ~/.aws out of reach in the first place.',
    etymology: 'first place（第1番目の順位・起点）。議論や手順を一番最初の原点に巻き戻して「初めからそもそも」と振り返る表現'
  },
  {
    id: 'id-16',
    category: 'idiom',
    term: 'out of reach',
    meaning: '手の届かないところに（隔離して）',
    usage: 'keep credentials out of reach',
    etymology: 'out of（〜の範囲の外へ）+ reach（手が届く範囲）→ 手をいくら伸ばしても届かない高さや金庫の中に安全にしまうこと'
  },
  {
    id: 'id-17',
    category: 'idiom',
    term: 'pick ... up',
    meaning: '（情報や信号を）拾い上げる、検知する',
    usage: 'so we\'d notice if anything picked it up.',
    etymology: 'pick（地面から拾う）+ up（上へ）。アンテナやセンサーがノイズの中から微弱な電波や異変をキャッチすること'
  },
  {
    id: 'id-18',
    category: 'idiom',
    term: 'anchor on',
    meaning: '〜を基準・前提とする、〜に立脚する',
    usage: 'Our model-layer defenses anchor on user intent.',
    etymology: 'anchor（錨・いかり）+ on（〜の上に）。船が流されないように海底に重い錨を降ろすように、確固たる基盤・基準に据える'
  },
  {
    id: 'id-19',
    category: 'idiom',
    term: 'be wary of',
    meaning: '〜を警戒する、用心する',
    usage: 'Be wary of custom components.',
    etymology: 'wary（古英語 wær: 注意深い、awareと同根）。危険の兆候を見逃さないよう目を光らせて警戒すること'
  },
  {
    id: 'id-20',
    category: 'idiom',
    term: 'battle-tested',
    meaning: '実戦で鍛え上げられた、過酷な検証済みの',
    usage: 'battle-tested hypervisors and container runtimes',
    etymology: 'battle（戦場・実戦）+ tested（試された）。机上の空論ではなく、実際の過酷な戦場や本番トラフィックで鍛え抜かれた'
  },

  // 4. 英文法・構文の特徴一覧 (10構文)
  {
    id: 'gr-1',
    category: 'grammar',
    term: '比例変化の倒置構文（As ..., so does S）',
    meaning: '「S1が〜するにつれて、S2もまた同様に〜する」',
    structure: 'As + S1 + V1, so + 助動詞/be動詞 + S2',
    explanation: '前半の主節と後半の響き合いが強調され、冒頭のキャッチコピーとして強い推進力を生む格調高い倒置表現です。',
    etymology: 'As（〜と同じように）と so（同様に）が対をなす古風で格調高い呼応構文。旧約聖書や古典英語の対比修辞学から現代の論説・格言に受け継がれている'
  },
  {
    id: 'gr-2',
    category: 'grammar',
    term: '仮定法過去完了による過去の対比（would have + 過去分詞）',
    meaning: '「（もし過去の前提であれば）〜していただろうに」',
    structure: '過去の時制を表す副詞句, S + would have + 過去分詞',
    explanation: '「もし12か月前であれば、（あり得ないこととして）即座に却下していただろう（＝しかし今では日常茶飯事である）」という、過去の前提と現在の現実との鮮やかな対比を示します。',
    etymology: 'would（意志の過去形）+ have p.p.（過去完了）。過去の時制の副詞句（Twelve months agoなど）が実質的なif節の役割を果たし、現在との劇的な変化を浮き彫りにする'
  },
  {
    id: 'gr-3',
    category: 'grammar',
    term: '「The + 比較級 ..., the + 比較級 ...」構文 ＋ 結果の分詞構文',
    meaning: '「〜すればするほど、ますます…になり、その結果〜となる」',
    structure: 'The + 比較級 + S1 + V1, the + 比較級 + S2 + V2, V-ing...',
    explanation: '「見れば見るほど注意を払わなくなる」という相関関係を提示し、後半のカンマ付き分詞構文（, becoming...）で自然な因果の帰結を滑らかに付加しています。',
    etymology: '構文内の「the」は定冠詞ではなく、古英語の指示代名詞の具格「þē（それだけ〜）」に由来。「Aの度合いが増すそれだけ、Bの度合いも増す」という計量関係を表す'
  },
  {
    id: 'gr-4',
    category: 'grammar',
    term: '程度・結果を表す「形容詞/副詞 + enough that 節」',
    meaning: '「〜するほど十分に…だ」',
    structure: 'S + V + 形容詞 + enough that + S\' + V\'',
    explanation: 'フォーマルな論説では enough to do よりも enough that S V が頻出します。「損失が十分に大きくなり、その結果としてリスク計算が傾く」という論理的帰結を明瞭に表現します。',
    etymology: 'enough（古英語 genōg: 十分な）に結果を表すthat節が結合。so ... that構文と似た「結果・帰結」を導く客観的・学術的な構文形態'
  },
  {
    id: 'gr-5',
    category: 'grammar',
    term: '関係代名詞の目的格の省略（接触節）',
    meaning: '「誰も〜しようとすら思わなかった制約」',
    structure: '先行詞(restrictions) + [that/which (省略)] + nobody thought to write down',
    explanation: '名詞の直後に S + V を即座に続けることで、文のリズム感を損なわずに端的に修飾しています。',
    etymology: '英語史において中英語期から定着した「接触節（Contact Clause）」。関係代名詞をあえて挟まず名詞と動詞を直結させ、思考のスピード感を高める'
  },
  {
    id: 'gr-6',
    category: 'grammar',
    term: '非制限用法の関係代名詞（, which）による理由付け',
    meaning: '「〜であるが、これこそが…である理由だ」',
    structure: ', which is why + S + V',
    explanation: 'カンマ以降の which が直前の文全体を先行詞とし、続く is why... で「だからこそ単体では成り立たないのだ」と論理的結論を導いています。',
    etymology: 'whichが直前の「一文全体の事実」を丸ごと受け止め、等位接続詞（and that is why）のように機能して議論を前に進める論理的展開の要石'
  },
  {
    id: 'gr-7',
    category: 'grammar',
    term: '前置詞 ＋ 関係代名詞（in which / under which）',
    meaning: '「その中で〜する環境 / その状況下で」',
    structure: '先行詞 + in which + 完全な文',
    explanation: '関係副詞 where を使うよりも、物理的・空間的な枠組みを厳密に特定する論文・技術仕様書らしいフォーマルな響きを持ちます。',
    etymology: '前置詞（in, under, with）が関係代名詞の前に位置することで、格関係が厳密に明示されるラテン語的で格調高い文語スタイル'
  },
  {
    id: 'gr-8',
    category: 'grammar',
    term: '対比・代替の「Rather than V-ing, S + V」構文',
    meaning: '「Aをするのではなく、Bをする」',
    structure: 'Rather than V-ing A, S + V + B',
    explanation: 'what the agent does（事後動的挙動）と what it\'s able to do（能力の境界）という2つの名詞節が美しいパラレル構造（対称性）を形成しています。',
    etymology: 'ratherは古英語 hræðe（早く、進んで）の比較級。「Aの方を早く選ぶのではなく、Bを選ぶ」という選択と優先順位の対比から発達'
  },
  {
    id: 'gr-9',
    category: 'grammar',
    term: '譲歩・無関係を表す「regardless of whether A, B, or C」',
    meaning: '「原因がAであれ、Bであれ、Cであれ、それに関わらず」',
    structure: 'regardless of whether + S + is + [A, B, or C]',
    explanation: '3つ以上の選択肢を並列させ、いかなる要因であっても境界防御が破られてはならないという論理の普遍性と堅牢性を表現しています。',
    etymology: 'regard（注視する、考慮する）+ -less（〜のない）→「何があろうとそれに気を取られたり考慮に入れたりしない・普遍的に成り立つ」'
  },
  {
    id: 'gr-10',
    category: 'grammar',
    term: '名詞構文（Nominalization）による簡潔で重厚な表現',
    meaning: '「結果は〜の○%の削減であった（＝その結果○%減少した）」',
    structure: 'S(The result) was an 84% reduction in permission prompts...',
    explanation: '「As a result, prompts were reduced by 84%」と動詞で述べる代わりに、「The result was an 84% reduction...」と名詞を中心に据えることで、客観的なデータ・実績を淡々と力強く報告する英語特有の表現法です。',
    etymology: '学術論文やビジネス報告で多用される名詞化（Nominalization）。感情や動作の主体を後退させ、客観的事実や測定数値を文の主役に押し出す効果を持つ'
  }
];
