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
  example: string; // サンプル英文
  exampleJa?: string; // サンプル英文の和訳
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
    example: 'We implement multi-layered containment across all products.',
    exampleJa: '私たちは全製品にわたって多層的な封じ込め（安全制御）を実装しています。'
  },
  {
    id: 'gw-2',
    category: 'general_word',
    term: 'blast radius',
    pos: 'n. phr.',
    meaning: '被害想定範囲、影響範囲（元は爆発半径）',
    usage: 'エージェントの誤動作・攻撃時の最大被害規模',
    example: 'As agents grow more capable, so does their potential blast radius.',
    exampleJa: 'エージェントの能力が高まるにつれて、その潜在的な被害想定範囲も拡大します。'
  },
  {
    id: 'gw-3',
    category: 'general_word',
    term: 'cap',
    pos: 'v.',
    meaning: '上限を定める、抑える',
    usage: '潜在的被害範囲を制限する',
    example: 'We need to cap the potential damage an autonomous agent could cause.',
    exampleJa: '自律型エージェントが引き起こし得る潜在的被害に上限を設ける必要があります。'
  },
  {
    id: 'gw-4',
    category: 'general_word',
    term: 'sufficient',
    pos: 'adj.',
    meaning: '十分な',
    usage: '〜をダウンさせるのに十分な権限',
    example: 'He had access sufficient to take down an internal Anthropic service.',
    exampleJa: '彼はAnthropicの内部サービスを停止させるのに十分なアクセス権限を持っていました。'
  },
  {
    id: 'gw-5',
    category: 'general_word',
    term: 'deployment',
    pos: 'n.',
    meaning: '本番配備、導入、展開',
    usage: 'モデルや製品の本番運用',
    example: 'Safe deployment of autonomous systems requires careful safeguards.',
    exampleJa: '自律システムの安全な本番配備には、入念な安全対策が不可欠です。'
  },
  {
    id: 'gw-6',
    category: 'general_word',
    term: 'safeguard',
    pos: 'n.',
    meaning: '安全対策、保護措置',
    usage: 'モデルの訓練・運用における防御策',
    example: 'Progress on safeguards has steadily driven down the failure rate.',
    exampleJa: '安全対策の進歩により、障害の発生率は着実に低下しています。'
  },
  {
    id: 'gw-7',
    category: 'general_word',
    term: 'autonomous',
    pos: 'adj.',
    meaning: '自律的な、自立型の',
    usage: '自律型AIエージェント',
    example: 'Autonomous agents can perform complex tasks without constant oversight.',
    exampleJa: '自律型エージェントは常時の監視なしに複雑なタスクを遂行できます。'
  },
  {
    id: 'gw-8',
    category: 'general_word',
    term: 'deem',
    pos: 'v.',
    meaning: '（〜だと）見なす、判断する',
    usage: '公開するには危険すぎると判断された',
    example: 'The action was deemed too dangerous to run unattended.',
    exampleJa: 'その操作は監視なしで実行するには危険すぎると判断されました。'
  },
  {
    id: 'gw-9',
    category: 'general_word',
    term: 'fallible',
    pos: 'adj.',
    meaning: '誤りを犯しやすい、不完全な',
    usage: '人間による確認作業はミスが起きやすい',
    example: 'Human review is inherently fallible under heavy workloads.',
    exampleJa: '過密な作業負荷の下では、人間のチェックは本質的にミスを犯しやすいものです。'
  },
  {
    id: 'gw-10',
    category: 'general_word',
    term: 'telemetry',
    pos: 'n.',
    meaning: '利用状況データ収集、遠隔測定・ログ',
    usage: 'ユーザーの承認行動ログ',
    example: 'Telemetry helps identify anomalous behavior before damage occurs.',
    exampleJa: 'テレメトリデータは被害が出る前に異常な挙動を特定するのに役立ちます。'
  },
  {
    id: 'gw-11',
    category: 'general_word',
    term: 'diligent',
    pos: 'adj.',
    meaning: '勤勉な、入念な、配慮の行き届いた',
    usage: '承認作業への注意深さ',
    example: 'Users become much less diligent in their supervision over time.',
    exampleJa: 'ユーザーは時間が経つにつれて監視作業において入念さを欠くようになります。'
  },
  {
    id: 'gw-12',
    category: 'general_word',
    term: 'fatigue',
    pos: 'n.',
    meaning: '疲労、消耗',
    usage: 'approval fatigue（承認疲れ・形骸化）',
    example: 'Excessive prompts cause approval fatigue, leading to accidental approvals.',
    exampleJa: '過度なプロンプト表示は承認疲れを引き起こし、安易な承認につながります。'
  },
  {
    id: 'gw-13',
    category: 'general_word',
    term: 'probabilistic',
    pos: 'adj.',
    meaning: '確率論的な（↔ deterministic: 決定論的な）',
    usage: 'モデルの出力は確率的で完全ではない',
    example: 'LLMs are probabilistic models, which means 100% reliability is impossible.',
    exampleJa: 'LLMは確率論的モデルであるため、100%の確実性はあり得ません。'
  },
  {
    id: 'gw-14',
    category: 'general_word',
    term: 'enforce',
    pos: 'v.',
    meaning: '施行する、強制・適用する',
    usage: 'アクセス境界を厳格に適用する',
    example: 'We supervise what the agent is able to do by enforcing access boundaries.',
    exampleJa: 'アクセス境界を厳格に適用することで、エージェントが実行可能な範囲を制御します。'
  },
  {
    id: 'gw-15',
    category: 'general_word',
    term: 'egress',
    pos: 'n.',
    meaning: '送信、外部への出口（↔ ingress）',
    usage: '外部通信・送信の制御（egress controls）',
    example: 'Strict egress controls prevent credentials from leaving the sandbox.',
    exampleJa: '厳格な外部通信（Egress）制御により、サンドボックスから認証情報が漏洩するのを防ぎます。'
  },
  {
    id: 'gw-16',
    category: 'general_word',
    term: 'devote',
    pos: 'v.',
    meaning: '（時間・労力を）注ぐ、捧げる',
    usage: '最も工数を注ぎ込んできた領域',
    example: 'This is the area we have devoted the most engineering effort to.',
    exampleJa: 'これこそ私たちが最もエンジニアリング工数を注ぎ込んできた領域です。'
  },
  {
    id: 'gw-17',
    category: 'general_word',
    term: 'misuse',
    pos: 'n. / v.',
    meaning: '悪用、誤用',
    usage: 'ユーザーによる悪用や不注意な操作',
    example: 'Guardrails protect against both accidental misuse and intentional attacks.',
    exampleJa: 'ガードレールは、偶発的な誤用と意図的な攻撃の双方からシステムを保護します。'
  },
  {
    id: 'gw-18',
    category: 'general_word',
    term: 'misbehavior',
    pos: 'n.',
    meaning: '逸脱動作、不正動作',
    usage: 'モデルが意図しない問題行動を起こすこと',
    example: 'Detecting subtle model misbehavior requires real-time monitoring.',
    exampleJa: 'モデルの些細な逸脱動作を検知するには、リアルタイムのモニタリングが必要です。'
  },
  {
    id: 'gw-19',
    category: 'general_word',
    term: 'aligned',
    pos: 'adj.',
    meaning: '（AIが人間の意図や価値観に）沿った、整合した',
    usage: 'アライメント評価で適合度が高まっている',
    example: 'Even highly aligned models still require hard security boundaries.',
    exampleJa: 'いかに高度にアライメントされたモデルであっても、強固なセキュリティ境界が必要です。'
  },
  {
    id: 'gw-20',
    category: 'general_word',
    term: 'shrink',
    pos: 'v.',
    meaning: '縮小する、減少する',
    usage: 'リスクが必ずしも減るとは限らない',
    example: 'The risk does not necessarily shrink as capabilities advance.',
    exampleJa: '能力が向上したからといって、リスクが必ずしも減少するとは限りません。'
  },
  {
    id: 'gw-21',
    category: 'general_word',
    term: 'exfiltrate',
    pos: 'v.',
    meaning: '（機密情報などを）不正持ち出しする',
    usage: '外部へ認証情報を盗み出す',
    example: 'An attacker might try to exfiltrate secret keys via external requests.',
    exampleJa: '攻撃者は外部リクエストを介してシークレットキーを不正持ち出ししようとする可能性があります。'
  },
  {
    id: 'gw-22',
    category: 'general_word',
    term: 'perimeter',
    pos: 'n.',
    meaning: '防御境界線、周囲',
    usage: '厳格な境界線を敷く',
    example: 'Establish a hard security perimeter around the execution sandbox.',
    exampleJa: '実行サンドボックスの周囲に強固なセキュリティ防御境界線を構築します。'
  },
  {
    id: 'gw-23',
    category: 'general_word',
    term: 'unattended',
    pos: 'adj.',
    meaning: '監視なしの、無人の',
    usage: '人間の常時承認なしで実行する',
    example: 'Running agents unattended requires the highest degree of containment.',
    exampleJa: 'エージェントを無人監視で実行するには、最高水準の封じ込め対策が求められます。'
  },
  {
    id: 'gw-24',
    category: 'general_word',
    term: 'susceptibility',
    pos: 'n.',
    meaning: '影響を受けやすさ、脆弱性',
    usage: 'プロンプトインジェクションへの耐性度',
    example: 'We evaluate the model\'s susceptibility to indirect prompt injection.',
    exampleJa: '間接プロンプトインジェクションに対するモデルの脆弱性（影響の受けやすさ）を検証します。'
  },
  {
    id: 'gw-25',
    category: 'general_word',
    term: 'overeager',
    pos: 'adj.',
    meaning: '勇み足の、熱心すぎる',
    usage: '先走りすぎたエージェントの挙動',
    example: 'An overeager agent might delete files to free up disk space.',
    exampleJa: '先走りすぎたエージェントはディスク容量を空けようとして重要なファイルを削除してしまう恐れがあります。'
  },
  {
    id: 'gw-26',
    category: 'general_word',
    term: 'ephemeral',
    pos: 'adj.',
    meaning: '一時的な、セッション限りの',
    usage: 'セッション終了時に消去されるファイルシステム',
    example: 'Agents execute within ephemeral environments that reset after each task.',
    exampleJa: 'エージェントはタスクごとにリセットされる一時的な（エフェメラルな）環境で実行されます。'
  },
  {
    id: 'gw-27',
    category: 'general_word',
    term: 'adversary',
    pos: 'n.',
    meaning: '敵対者、サイバー攻撃者',
    usage: '豊富な資金・スキルを持つ攻撃者',
    example: 'We design defenses assuming a sophisticated adversary.',
    exampleJa: '巧妙なスキルを持つ攻撃者を想定して防御システムを設計しています。'
  },
  {
    id: 'gw-28',
    category: 'general_word',
    term: 'consequential',
    pos: 'adj.',
    meaning: '重大な結果を招く、深刻な',
    usage: '最も影響の大きかったセキュリティインシデント',
    example: 'Prioritize mitigating the most consequential failure modes first.',
    exampleJa: '最も深刻な被害を招く障害パターンへの対策を最優先します。'
  },
  {
    id: 'gw-29',
    category: 'general_word',
    term: 'tractable',
    pos: 'adj.',
    meaning: '扱いやすい、現実的に解決可能な',
    usage: '技術者相手だからこそ成立する現実的解決策',
    example: 'Focusing on high-impact scenarios makes the security problem tractable.',
    exampleJa: '影響の大きいシナリオに集中することで、セキュリティ課題を現実的に解決可能なものにします。'
  },
  {
    id: 'gw-30',
    category: 'general_word',
    term: 'mitigate',
    pos: 'v.',
    meaning: '軽減する、緩和する',
    usage: '不注意な承認を緩和・抑制する',
    example: 'Multi-layer defenses mitigate the danger of prompt injection.',
    exampleJa: '多層防御によってプロンプトインジェクションの危険性を軽減します。'
  },
  {
    id: 'gw-31',
    category: 'general_word',
    term: 'incautious',
    pos: 'adj.',
    meaning: '不注意な、軽率な',
    usage: 'よく確認せずに行う安易な承認',
    example: 'Approval fatigue increases the rate of incautious approvals.',
    exampleJa: '承認疲れは不注意な承認の発生率を高めます。'
  },
  {
    id: 'gw-32',
    category: 'general_word',
    term: 'auditable',
    pos: 'adj.',
    meaning: '監査・検証可能な',
    usage: 'コードが公開され第三者が検証できる',
    example: 'All agent actions must produce an auditable trail of events.',
    exampleJa: 'エージェントのすべての行動は検証可能な監査証跡を残す必要があります。'
  },
  {
    id: 'gw-33',
    category: 'general_word',
    term: 'drift',
    pos: 'n.',
    meaning: '（意図からの）逸脱、ズレ',
    usage: 'エージェントの挙動が目標からずれること',
    example: 'Notice drift in the first place before irreversible actions occur.',
    exampleJa: '取り返しのつかない操作が起きる前に、初期段階での挙動の逸脱に気づくことが重要です。'
  },
  {
    id: 'gw-34',
    category: 'general_word',
    term: 'consent',
    pos: 'v. / n.',
    meaning: '同意する / 承認、同意',
    usage: 'ユーザーの同意を得る前の実行',
    example: 'Never perform irreversible mutations without explicit user consent.',
    exampleJa: 'ユーザーの明示的な同意なしに不可逆な変更処理を実行してはなりません。'
  },
  {
    id: 'gw-35',
    category: 'general_word',
    term: 'defer',
    pos: 'v.',
    meaning: '延期する、後回しにする',
    usage: 'ユーザー承認まで処理を遅延させる',
    example: 'Defer risky tool executions until the human reviewer has confirmed.',
    exampleJa: '人間の確認者が承認するまで、リスクのあるツールの実行を保留・遅延させます。'
  },
  {
    id: 'gw-36',
    category: 'general_word',
    term: 'implicitly',
    pos: 'adv.',
    meaning: '暗黙のうちに、無条件に',
    usage: 'ローカルだからと暗黙に信用してはならない',
    example: 'Never implicitly trust inputs originating from local files.',
    exampleJa: 'ローカルファイル由来の入力であっても、暗黙のうちに信用してはなりません。'
  },
  {
    id: 'gw-37',
    category: 'general_word',
    term: 'anomalous',
    pos: 'adj.',
    meaning: '異常な、変則的な',
    usage: '判定器が検知すべき不審な兆候',
    example: 'Detect anomalous patterns in tool invocation requests.',
    exampleJa: 'ツール呼び出しリクエストの中にある変則的なパターンを検出します。'
  },
  {
    id: 'gw-38',
    category: 'general_word',
    term: 'provenance',
    pos: 'n.',
    meaning: '出所、来歴、真正性',
    usage: 'リクエストの発信元が正当かどうかの出所',
    example: 'Verify the provenance of instructions before executing system commands.',
    exampleJa: 'システムコマンドを実行する前に、指示の出所・真正性を検証します。'
  },
  {
    id: 'gw-39',
    category: 'general_word',
    term: 'opaque',
    pos: 'adj.',
    meaning: '不透明な、内部を窺い知れない',
    usage: '外部監視ツールから中身が見えないVM',
    example: 'Black-box VMs can be opaque to external host telemetry.',
    exampleJa: 'ブラックボックスVMはホスト側の外部テレメトリから内部が見えにくい（不透明な）場合があります。'
  },

  // 2. AI・セキュリティ技術専門用語 (13語)
  {
    id: 'tw-1',
    category: 'tech_word',
    term: 'human-in-the-loop (HITL)',
    pos: 'n.',
    meaning: '人間がプロセスの途中で介在・承認する仕組み',
    usage: 'エージェントの危険な操作を人間が確認して承認するアーキテクチャ',
    example: 'A human-in-the-loop setup ensures that high-risk actions are approved by engineers.',
    exampleJa: '人間参加型（HITL）の構成により、高リスクな操作はエンジニアの承認を得ることが保証されます。'
  },
  {
    id: 'tw-2',
    category: 'tech_word',
    term: 'sandbox',
    pos: 'n.',
    meaning: '外部に影響を与えないよう隔離された安全な実行環境',
    usage: 'コード実行やファイルアクセスを閉じ込める隔離領域',
    example: 'Untrusted code is executed strictly within an isolated sandbox.',
    exampleJa: '信頼されていないコードは、隔離されたサンドボックス内で厳格に実行されます。'
  },
  {
    id: 'tw-3',
    category: 'tech_word',
    term: 'prompt injection',
    pos: 'n.',
    meaning: '悪意あるプロンプトを入力してモデルの制限を突破・乗っ取る攻撃',
    usage: '外部データやWebページに仕込まれた指示によるAIのハイジャック',
    example: 'Indirect prompt injection can hijack an agent when reading web pages.',
    exampleJa: '間接プロンプトインジェクションは、Webページを読み込む際にエージェントを乗っ取る可能性があります。'
  },
  {
    id: 'tw-4',
    category: 'tech_word',
    term: 'runtime',
    pos: 'n.',
    meaning: 'プログラムが動作する実行環境基盤',
    usage: 'コンテナやエージェントコードを実行する基盤層',
    example: 'Battle-tested container runtimes enforce resource limits and process isolation.',
    exampleJa: '実戦で検証されたコンテナランタイムが、リソース制限とプロセス隔離を適用します。'
  },
  {
    id: 'tw-5',
    category: 'tech_word',
    term: 'orchestration',
    pos: 'n.',
    meaning: '複数システムやコンテナ群を自動統合・調整する仕組み',
    usage: 'エージェントタスク用の仮想環境やツールの自動プロビジョニング',
    example: 'The orchestration layer provisions clean sandboxes on demand.',
    exampleJa: 'オーケストレーション層が、オンデマンドでクリーンなサンドボックスを自動準備します。'
  },
  {
    id: 'tw-6',
    category: 'tech_word',
    term: 'classifier / probe',
    pos: 'n.',
    meaning: '入力や内部状態を監視・分類するための検出モデル・測定器',
    usage: 'プロンプトや出力の危険度をリアルタイムに検知する補助モデル',
    example: 'A lightweight classifier checks prompts for policy violations.',
    exampleJa: '軽量な分類器（クラシファイア）が、プロンプトのポリシー違反をチェックします。'
  },
  {
    id: 'tw-7',
    category: 'tech_word',
    term: 'red teaming',
    pos: 'n.',
    meaning: '攻撃側の視点でシステムの弱点や脆弱性を検証する疑似攻撃演習',
    usage: '社内の専門チームがエージェントの防御網を突破しようと試みるテスト',
    example: 'Rigorous red teaming reveals vulnerabilities before public release.',
    exampleJa: '厳格なレッドチーミング演習により、一般公開前に脆弱性を明らかにします。'
  },
  {
    id: 'tw-8',
    category: 'tech_word',
    term: 'MCP (Model Context Protocol)',
    pos: 'n.',
    meaning: 'モデルと各種データ・ツールをつなぐオープンプロトコル',
    usage: 'ClaudeがファイルシステムやGit、APIなどのツールと安全に連携する標準規格',
    example: 'Claude interacts with external tools safely through the Model Context Protocol.',
    exampleJa: 'ClaudeはModel Context Protocolを通じて外部ツールと安全にやり取りします。'
  },
  {
    id: 'tw-9',
    category: 'tech_word',
    term: 'payload',
    pos: 'n.',
    meaning: 'サイバー攻撃において実際に悪意ある処理を実行する本体データ',
    usage: 'インジェクション攻撃でシステムを侵害するコードやコマンド',
    example: 'The attacker hid a malicious payload inside an innocent-looking text file.',
    exampleJa: '攻撃者は無害に見えるテキストファイルの中に悪意あるペイロードを潜ませていました。'
  },
  {
    id: 'tw-10',
    category: 'tech_word',
    term: 'canary string',
    pos: 'n.',
    meaning: '情報漏洩や不正侵入を検知するためにあらかじめ仕込んでおく特定の目印文字列',
    usage: 'エージェントが機密データを外部送信していないかを検知するトラップ',
    example: 'Canary strings trigger immediate alerts if they appear in egress traffic.',
    exampleJa: '仕込んでおいたカナリア文字列が外部通信に現れた場合、即座にアラートが発報されます。'
  },
  {
    id: 'tw-11',
    category: 'tech_word',
    term: 'hypervisor',
    pos: 'n.',
    meaning: '仮想マシン（VM）を起動・制御するための基盤仮想化ソフトウェア',
    usage: 'セキュアな隔離境界を提供する仮想化レイヤー',
    example: 'Hardware-level hypervisors provide strong tenant isolation.',
    exampleJa: 'ハードウェアレベルのハイパーバイザが、強力なテナント間隔離を提供します。'
  },
  {
    id: 'tw-12',
    category: 'tech_word',
    term: 'EDR (Endpoint Detection and Response)',
    pos: 'n.',
    meaning: '端末の挙動を監視し脅威を検知・対処するセキュリティシステム',
    usage: 'VMやホスト端末での不審なプロセス実行やネットワーク接続の監視',
    example: 'EDR agents monitor anomalous process executions on the host.',
    exampleJa: 'EDRエージェントが、ホスト端末上の不審なプロセス実行を監視します。'
  },
  {
    id: 'tw-13',
    category: 'tech_word',
    term: 'MITM (Man-in-the-Middle) proxy',
    pos: 'n.',
    meaning: '通信の間に割り込んで中継・検査・改変を行うプロキシ',
    usage: 'エージェントのアウトバウンドHTTPリクエストを傍受・検証する仕組み',
    example: 'An outbound MITM proxy inspects API calls for credential leakage.',
    exampleJa: 'アウトバウンドMITMプロキシが、API呼び出しに認証情報の漏洩がないかを検査します。'
  },

  // 3. 熟語・句動詞・コロケーション (20語)
  {
    id: 'id-1',
    category: 'idiom',
    term: 'reject out of hand',
    meaning: '即座に却下する、頭から拒絶する',
    usage: 'we\'d have rejected out of hand the idea...（以前なら即座に却下していた発想）',
    example: 'Twelve months ago, we\'d have rejected out of hand the idea of granting Claude access.',
    exampleJa: '12か月前であれば、Claudeにアクセス権を与えるなどという発想は即座に却下していたでしょう。'
  },
  {
    id: 'id-2',
    category: 'idiom',
    term: 'take down',
    meaning: '（サーバーやサービスを）停止させる、ダウンさせる',
    usage: 'sufficient to take down an internal Anthropic service',
    example: 'A single misconfigured command was sufficient to take down an internal service.',
    exampleJa: '設定ミスのあるコマンド1つで、内部サービスをダウンさせるには十分でした。'
  },
  {
    id: 'id-3',
    category: 'idiom',
    term: 'drive down',
    meaning: '（数値・確率・コストを）押し下げる',
    usage: 'Progress on safeguards has steadily driven down the first',
    example: 'Progress on safeguards has steadily driven down the failure rate.',
    exampleJa: '安全対策の進歩によって、障害発生率は着実に押し下げられてきました。'
  },
  {
    id: 'id-4',
    category: 'idiom',
    term: 'tip toward',
    meaning: '（バランスや天秤が）〜へ傾く',
    usage: 'the risk-reward calculation tips heavily toward adoption',
    example: 'The risk-reward calculation tips heavily toward adoption.',
    exampleJa: 'リスクとリターンの計算は、導入の推進へと大きく傾いています。'
  },
  {
    id: 'id-5',
    category: 'idiom',
    term: 'as long as ...',
    meaning: '〜である限りは（条件）',
    usage: 'as long as products can be made safe.',
    example: 'We can deploy autonomous agents as long as products can be made safe.',
    exampleJa: '製品の安全性が確保できる限りにおいて、自律型エージェントを展開できます。'
  },
  {
    id: 'id-6',
    category: 'idiom',
    term: 'hold up',
    meaning: '（負荷や検証に）耐える、持ちこたえる、有効であり続ける',
    usage: 'This article shares what\'s held up, what\'s broken...',
    example: 'This article shares what\'s held up and what\'s broken under real workloads.',
    exampleJa: '本記事では、実際の負荷のもとで何が持ちこたえ、何が破綻したのかを共有します。'
  },
  {
    id: 'id-7',
    category: 'idiom',
    term: 'along the way',
    meaning: 'その過程で、これまでに、道中で',
    usage: 'what we\'ve learned about agent security along the way.',
    example: 'Here is what we have learned about agent security along the way.',
    exampleJa: 'これまでの道のりで私たちがエージェントセキュリティに関して学んできたことをまとめます。'
  },
  {
    id: 'id-8',
    category: 'idiom',
    term: 'route around',
    meaning: '（障害や制限を）迂回する、すり抜ける',
    usage: 'by routing around restrictions nobody thought to write down.',
    example: 'The agent succeeded by routing around restrictions nobody thought to write down.',
    exampleJa: 'エージェントは、誰も明文化しようとすら思わなかった制約を迂回して実行しました。'
  },
  {
    id: 'id-9',
    category: 'idiom',
    term: 'put ... to work',
    meaning: '〜を活用する、稼働させる、役立てる',
    usage: 'capabilities that are sometimes put to work in unexpected ways.',
    example: 'Model capabilities are sometimes put to work in unexpected ways.',
    exampleJa: 'モデルの能力は、時に予期せぬ形で活用されることがあります。'
  },
  {
    id: 'id-10',
    category: 'idiom',
    term: 'stand alone',
    meaning: '単独で成り立つ、独立して機能する',
    usage: 'model layer will never be 100% effective, which is why it can\'t stand alone.',
    example: 'Model-level defenses will never be 100% effective, which is why they cannot stand alone.',
    exampleJa: 'モデル層の防御が100%有効になることはないため、単独で機能させることはできません。'
  },
  {
    id: 'id-11',
    category: 'idiom',
    term: 'pick up the slack',
    meaning: '不足分を補う、穴埋め・尻拭いをする',
    usage: 'the model layer has to pick up the slack',
    example: 'The model layer has to pick up the slack when host boundaries fail.',
    exampleJa: 'ホスト側の境界防御が失敗した時は、モデル層がその不足分を補わなければなりません。'
  },
  {
    id: 'id-12',
    category: 'idiom',
    term: 'higher up the chain',
    meaning: '（プロセスの）より上位の段階で、上流で',
    usage: 'defenses can be added higher up the chain...',
    example: 'Defenses can be added higher up the chain before prompts reach the model.',
    exampleJa: 'プロンプトがモデルに届く前の、処理チェーンのより上位の段階で防御を追加できます。'
  },
  {
    id: 'id-13',
    category: 'idiom',
    term: 'come back to',
    meaning: '（後の文脈で）再び触れる、立ち戻る',
    usage: 'We\'ll come back to this later...',
    example: 'We\'ll come back to this architectural design in the next section.',
    exampleJa: 'このアーキテクチャ設計については、次のセクションで再び詳しく取り上げます。'
  },
  {
    id: 'id-14',
    category: 'idiom',
    term: 'go off track',
    meaning: '脱線する、意図から外れる',
    usage: 'supervise the agent only when it goes off track.',
    example: 'We supervise the agent only when it goes off track.',
    exampleJa: 'エージェントが意図から外れて脱線したときにのみ、人間が介入して監督します。'
  },
  {
    id: 'id-15',
    category: 'idiom',
    term: 'in the first place',
    meaning: 'そもそも、初めから',
    usage: 'notice drift in the first place / keep ~/.aws out of reach in the first place.',
    example: 'Keep critical credentials out of reach in the first place.',
    exampleJa: 'そもそも最初から、重要な認証情報を手の届かない場所に隔離しておくべきです。'
  },
  {
    id: 'id-16',
    category: 'idiom',
    term: 'out of reach',
    meaning: '手の届かないところに（隔離して）',
    usage: 'keep credentials out of reach',
    example: 'We keep SSH keys strictly out of reach of the sandboxed agent.',
    exampleJa: 'サンドボックス内のエージェントの手の届かない場所にSSHキーを厳重に隔離しています。'
  },
  {
    id: 'id-17',
    category: 'idiom',
    term: 'pick ... up',
    meaning: '（情報や信号を）拾い上げる、検知する',
    usage: 'so we\'d notice if anything picked it up.',
    example: 'We monitor egress traffic so we notice if any classifier picks up leaks.',
    exampleJa: 'いずれかの分類器が漏洩を拾い上げた際にすぐに気づけるよう、送信トラフィックを監視します。'
  },
  {
    id: 'id-18',
    category: 'idiom',
    term: 'anchor on',
    meaning: '〜を基準・前提とする、〜に立脚する',
    usage: 'Our model-layer defenses anchor on user intent.',
    example: 'Our model-layer defenses anchor on user intent.',
    exampleJa: '私たちのモデル層防御は、ユーザーの意図を確固たる前提・基準としています。'
  },
  {
    id: 'id-19',
    category: 'idiom',
    term: 'be wary of',
    meaning: '〜を警戒する、用心する',
    usage: 'Be wary of custom components.',
    example: 'Be wary of building custom sandboxing solutions when standard ones exist.',
    exampleJa: '標準的な解決策が存在するときに、自前でカスタムのサンドボックスを作ることは警戒すべきです。'
  },
  {
    id: 'id-20',
    category: 'idiom',
    term: 'battle-tested',
    meaning: '実戦で鍛え上げられた、過酷な検証済みの',
    usage: 'battle-tested hypervisors and container runtimes',
    example: 'Always rely on battle-tested hypervisors and container runtimes.',
    exampleJa: '常に過酷な実戦で鍛え上げられたハイパーバイザとコンテナランタイムを頼りにしてください。'
  },

  // 4. 英文法・構文の特徴一覧 (10構文)
  {
    id: 'gr-1',
    category: 'grammar',
    term: '比例変化の倒置構文（As ..., so does S）',
    meaning: '「S1が〜するにつれて、S2もまた同様に〜する」',
    structure: 'As + S1 + V1, so + 助動詞/be動詞 + S2',
    explanation: '通常の語順（their potential blast radius also grows）よりも、前半の主節と後半の響き合いが強調され、冒頭のキャッチコピーとして強い推進力を生む格調高い倒置表現です。',
    example: 'As agents grow more capable, so does their potential blast radius.',
    exampleJa: 'エージェントの能力が高まるにつれて、その潜在的な被害想定範囲も同様に拡大する。'
  },
  {
    id: 'gr-2',
    category: 'grammar',
    term: '仮定法過去完了による過去の対比（would have + 過去分詞）',
    meaning: '「（もし過去の前提であれば）〜していただろうに」',
    structure: '過去の時制を表す副詞句, S + would have + 過去分詞',
    explanation: '「もし12か月前であれば、（あり得ないこととして）即座に却下していただろう（＝しかし今では日常茶飯事である）」という、過去の前提と現在の現実との鮮やかな対比を示します。if節がなくても副詞句が条件節の役割を果たしています。',
    example: 'Twelve months ago, we\'d have rejected out of hand the idea of granting Claude access to developer terminals.',
    exampleJa: '12か月前であれば、Claudeに開発ターミナルへのアクセスを与えるというアイデアは即座に却下していただろう。'
  },
  {
    id: 'gr-3',
    category: 'grammar',
    term: '「The + 比較級 ..., the + 比較級 ...」構文 ＋ 結果の分詞構文',
    meaning: '「〜すればするほど、ますます…になり、その結果〜となる」',
    structure: 'The + 比較級 + S1 + V1, the + 比較級 + S2 + V2, V-ing...',
    explanation: '前半で「見れば見るほど注意を払わなくなる」という相関関係を提示し、後半のカンマ付き分詞構文（, becoming...）で「そしてその結果、次第に入念さを欠くようになっていく」という自然な因果の帰結を滑らかに付加しています。',
    example: 'The more approvals a user sees, the less attention they pay to each, becoming over time much less diligent in their supervision.',
    exampleJa: 'ユーザーは承認要求を目にすればするほど1つ1つへの注意を払わなくなり、結果として時間の経過とともに入念さを大幅に欠くようになる。'
  },
  {
    id: 'gr-4',
    category: 'grammar',
    term: '程度・結果を表す「形容詞/副詞 + enough that 節」',
    meaning: '「〜するほど十分に…だ」',
    structure: 'S + V + 形容詞 + enough that + S\' + V\' （※動名詞の否定 not deploying も含有）',
    explanation: '学校文法では enough to do を習いますが、フォーマルな論説では enough that S V が頻出します。「導入しないことによる損失が大きくなり、その結果リスク計算が導入へと傾く」という論理的な帰結を明瞭に表現します。',
    example: 'The cost of not deploying grows large enough that the risk-reward calculation tips heavily toward adoption.',
    exampleJa: '配備を見送ることの損失が十分に大きくなり、その結果リスクとリターンの計算は導入へ大きく傾くことになる。'
  },
  {
    id: 'gr-5',
    category: 'grammar',
    term: '関係代名詞の目的格の省略（接触節）',
    meaning: '「誰も〜しようとすら思わなかった制約」',
    structure: '先行詞(restrictions) + [that/which (省略)] + nobody thought to write down',
    explanation: '先行詞 restrictions の直後に関係代名詞が省略されています。名詞の直後に S + V を即座に続けることで、文のリズム感を損なわずに端的に修飾しています。',
    example: 'The model succeeded by routing around restrictions nobody thought to write down.',
    exampleJa: 'モデルは、誰も明文化しようとすら思わなかった制約を迂回することですり抜けた。'
  },
  {
    id: 'gr-6',
    category: 'grammar',
    term: '非制限用法の関係代名詞（, which）による理由付け',
    meaning: '「〜であるが、これこそが…である理由だ」',
    structure: ', which is why + S + V',
    explanation: 'カンマ以降の which が直前の文全体（「モデル層の保護は決して100%にはならないこと」）を先行詞とし、続く is why... で「だからこそ単体では成り立たないのだ」と論理的結論を導いています。',
    example: 'Yet even with best-in-class defenses, protection in the model layer will never be 100% effective, which is why it can\'t stand alone.',
    exampleJa: 'しかし最高水準の防御を施してもモデル層の保護が100%になることは決してなく、これこそが単独で成立し得ない理由である。'
  },
  {
    id: 'gr-7',
    category: 'grammar',
    term: '前置詞 ＋ 関係代名詞（in which / under which）',
    meaning: '「その中で〜する環境 / その状況下で」',
    structure: '先行詞 + in which + 完全な文',
    explanation: '関係副詞 where を使うよりも、物理的・空間的な枠組みを厳密に特定する論文・技術仕様書らしいフォーマルな響きを持ちます。',
    example: 'We isolate the environment in which the agent runs from the host operating system.',
    exampleJa: 'エージェントが実行されるその環境を、ホスト側のオペレーティングシステムから完全に隔離する。'
  },
  {
    id: 'gr-8',
    category: 'grammar',
    term: '対比・代替の「Rather than V-ing, S + V」構文',
    meaning: '「Aをするのではなく、Bをする」',
    structure: 'Rather than V-ing A, S + V + B',
    explanation: 'what the agent does（実際に行う動的挙動）と what it\'s able to do（行い得る能力の限界・境界）という2つの名詞節が美しいパラレル構造（対称性）を形成しています。',
    example: 'Rather than supervising what the agent does, we supervise what it\'s able to do by enforcing access boundaries.',
    exampleJa: 'エージェントが実際に行う挙動を監視するのではなく、アクセス境界を強制することで行い得る能力そのものを制御する。'
  },
  {
    id: 'gr-9',
    category: 'grammar',
    term: '譲歩・無関係を表す「regardless of whether A, B, or C」',
    meaning: '「原因がAであれ、Bであれ、Cであれ、それに関わらず」',
    structure: 'regardless of whether + S + is + [A, B, or C]',
    explanation: '3つ以上の選択肢を並列させ、いかなる要因であっても境界防御が破られてはならないという論理の普遍性と堅牢性を表現しています。',
    example: 'The boundary must hold regardless of whether the cause is a user, a model finding a creative path, or an attacker.',
    exampleJa: 'その原因がユーザーであれ、創造的な抜け道を見つけたモデルであれ、あるいは攻撃者であれ、境界は維持されなければならない。'
  },
  {
    id: 'gr-10',
    category: 'grammar',
    term: '名詞構文（Nominalization）による簡潔で重厚な表現',
    meaning: '「結果は〜の○%の削減であった（＝その結果○%減少した）」',
    structure: 'S(The result) was an 84% reduction in permission prompts...',
    explanation: '「As a result, prompts were reduced by 84%」と動詞で述べる代わりに、「The result was an 84% reduction...」と名詞を中心に据えることで、客観的なデータ・実績を淡々と力強く報告する英語特有の表現法です。',
    example: 'The result was an 84% reduction in permission prompts without sacrificing security.',
    exampleJa: 'その結果は、セキュリティを犠牲にすることなく承認プロンプトを84%削減するというものであった。'
  }
];
