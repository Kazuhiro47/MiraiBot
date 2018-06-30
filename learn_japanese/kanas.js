class Kana {

}

class Hiragana extends Kana {

    constructor() {
        super();

        this.a = {
            'h|a': 'あ',
            'h|ka': 'か',
            'h|sa': 'さ',
            'h|ta': 'た',
            'h|na': 'な',
            'h|ha': 'は',
            'h|ma': 'ま',
            'h|ya': 'や',
            'h|ra': 'ら',
            'h|wa': 'わ',
        };

        this.i = {
            'h|i': 'い',
            'h|ki': 'き',
            'h|shi': 'し',
            'h|chi': 'ち',
            'h|ni': 'に',
            'h|hi': 'ひ',
            'h|mi': 'み',
            'h|ri': 'り',
        };

        this.u = {
            'h|u': 'う',
            'h|ku': 'く',
            'h|su': 'す',
            'h|tsu': 'つ',
            'h|nu': 'ぬ',
            'h|fu': 'ふ',
            'h|mu': 'む',
            'h|yu': 'ゆ',
            'h|ru': 'る',
        };

        this.e = {
            'h|e': 'え',
            'h|ke': 'け',
            'h|se': 'せ',
            'h|te': 'て',
            'h|ne': 'ね',
            'h|he': 'へ',
            'h|me': 'め',
            'h|re': 'れ',
        };

        this.o = {
            'h|o': 'お',
            'h|ko': 'こ',
            'h|so': 'そ',
            'h|to': 'と',
            'h|no': 'の',
            'h|ho': 'ほ',
            'h|mo': 'も',
            'h|ro': 'ろ',
            'h|wo': 'を',
            'h|yo': 'よ',
            'h|n': 'ん',
        };

        this.aDakutenHandakuten = {
            'h|ga': 'が',
            'h|za': 'ざ',
            'h|da': 'だ',
            'h|ba': 'ば',
            'h|pa': 'ぱ',
        };

        this.iDakutenHandakuten = {
            'h|gi': 'ぎ',
            'h|ji': 'じ',
            'h|bi': 'び',
            'h|pi': 'ぴ',
        };

        this.uDakutenHandakuten = {
            'h|gu': 'ぐ',
            'h|zu': 'ず',
            'h|dzu': 'づ',
            'h|bu': 'ぶ',
            'h|pu': 'ぷ',
        };

        this.eDakutenHandakuten = {
            'h|ge': 'げ',
            'h|ze': 'ぜ',
            'h|de': 'で',
            'h|be': 'べ',
            'h|pe': 'ぺ',
        };

        this.oDakutenHandakuten = {
            'h|go': 'ご',
            'h|zo': 'ぞ',
            'h|do': 'ど',
            'h|bo': 'ぼ',
            'h|po': 'ぽ',
        };

        this.aPalatalisated = {
            'h|kya': 'きゃ',
            'h|gya': 'ぎゃ',
            'h|sha': 'しゃ',
            'h|ja': 'じゃ',
            'h|cha': 'ちゃ',
            'h|nya': 'にゃ',
            'h|hya': 'ひゃ',
            'h|bya': 'びゃ',
            'h|pya': 'ぴゃ',
            'h|mya': 'みゃ',
            'h|rya': 'りゃ',
        };

        this.uPalatalisated = {
            'h|kyu': 'きゅ',
            'h|gyu': 'ぎゅ',
            'h|shu': 'しゅ',
            'h|ju': 'じゅ',
            'h|chu': 'ちゅ',
            'h|nyu': 'にゅ',
            'h|hyu': 'ひゅ',
            'h|byu': 'びゅ',
            'h|pyu': 'ぴゅ',
            'h|myu': 'みゅ',
            'h|ryu': 'りゅ',
        };

        this.oPalatalisated = {
            'h|kyo': 'きょ',
            'h|gyo': 'ぎょ',
            'h|sho': 'しょ',
            'h|jo': 'じょ',
            'h|cho': 'ちょ',
            'h|nyo': 'にょ',
            'h|hyo': 'ひょ',
            'h|byo': 'びょ',
            'h|pyo': 'ぴょ',
            'h|myo': 'みょ',
            'h|ryo': 'りょ',
        };
    }

}

class Katakana extends Kana {

    constructor() {
        super();

        this.a = {
            'k|a': 'ア',
            'k|ka': 'カ',
            'k|sa': 'サ',
            'k|ta': 'タ',
            'k|na': 'ナ',
            'k|ha': 'ハ',
            'k|ma': 'マ',
            'k|ya': 'ヤ',
            'k|ra': 'ラ',
            'k|wa': 'ワ',
        };

        this.i = {
            'k|i': 'イ',
            'k|ki': 'キ',
            'k|shi': 'シ',
            'k|chi': 'チ',
            'k|ni': 'ニ',
            'k|hi': 'ヒ',
            'k|mi': 'ミ',
            'k|ri': 'リ',
        };

        this.u = {
            'k|u': 'ウ',
            'k|ku': 'ク',
            'k|su': 'ス',
            'k|tsu': 'ツ',
            'k|nu': 'ヌ',
            'k|fu': 'フ',
            'k|mu': 'ム',
            'k|yu': 'ユ',
            'k|ru': 'ル',
        };

        this.e = {
            'k|e': 'エ',
            'k|ke': 'ケ',
            'k|se': 'セ',
            'k|te': 'テ',
            'k|ne': 'ネ',
            'k|he': 'ヘ',
            'k|me': 'メ',
            'k|re': 'レ',
        };

        this.o = {
            'k|o': 'オ',
            'k|ko': 'コ',
            'k|so': 'ソ',
            'k|to': 'ト',
            'k|no': 'ノ',
            'k|ho': 'ホ',
            'k|mo': 'モ',
            'k|yo': 'ヨ',
            'k|ro': 'ロ',
            'k|wo': 'ヲ',
            'k|n': 'ン',
        };

        this.aDakutenHandakuten = {
            'k|ga': 'ガ',
            'k|za': 'ザ',
            'k|da': 'ダ',
            'k|ba': 'バ',
            'k|pa': 'パ',
        };

        this.iDakutenHandakuten = {
            'k|gi': 'ギ',
            'k|ji': 'ジ',
            'k|bi': 'ビ',
            'k|pi': 'ピ',
        };

        this.uDakutenHandakuten = {
            'k|gu': 'グ',
            'k|zu': 'ズ',
            'k|dzu': 'ヅ',
            'k|bu': 'ブ',
            'k|pu': 'プ',
        };

        this.eDakutenHandakuten = {
            'k|ge': 'ゲ',
            'k|ze': 'ゼ',
            'k|de': 'デ',
            'k|be': 'ベ',
            'k|pe': 'ペ',
        };

        this.oDakutenHandakuten = {
            'k|go': 'ゴ',
            'k|zo': 'ゾ',
            'k|do': 'ド',
            'k|bo': 'ボ',
            'k|po': 'ポ',
        };

        this.aPalatalisated = {
            'k|kya': 'キャ',
            'k|gya': 'ギャ',
            'k|sha': 'シャ',
            'k|ja': 'ジャ',
            'k|cha': 'チャ',
            'k|nya': 'ニャ',
            'k|hya': 'ヒャ',
            'k|bya': 'ビャ',
            'k|pya': 'ピャ',
            'k|mya': 'ミャ',
            'k|rya': 'リャ',
        };

        this.uPalatalisated = {
            'k|kyu': 'キュ',
            'k|gyu': 'ギュ',
            'k|shu': 'シュ',
            'k|ju': 'ジュ',
            'k|chu': 'チュ',
            'k|nyu': 'ニュ',
            'k|hyu': 'ヒュ',
            'k|byu': 'ビュ',
            'k|pyu': 'ピュ',
            'k|myu': 'ミュ',
            'k|ryu': 'リュ',
        };

        this.oPalatalisated = {
            'k|kyo': 'キョ',
            'k|gyo': 'ギョ',
            'k|sho': 'ショ',
            'k|jo': 'ジョ',
            'k|cho': 'チョ',
            'k|nyo': 'ニョ',
            'k|hyo': 'ヒョ',
            'k|byo': 'ビョ',
            'k|pyo': 'ピョ',
            'k|myo': 'ミョ',
            'k|ryo': 'リョ',
        };

    }

}

module.exports = {Kana, Hiragana, Katakana};
