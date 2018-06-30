class Kana {

}

class Hiragana extends Kana {

    constructor() {
        super();

        this.a = {
            'a': 'あ',
            'ka': 'か',
            'sa': 'さ',
            'ta': 'た',
            'na': 'な',
            'ha': 'は',
            'ma': 'ま',
            'ya': 'や',
            'ra': 'ら',
            'wa': 'わ',
        };

        this.i = {
            'i': 'い',
            'ki': 'き',
            'shi': 'し',
            'chi': 'ち',
            'ni': 'に',
            'hi': 'ひ',
            'mi': 'み',
            'ri': 'り',
        };

        this.u = {
            'u': 'う',
            'ku': 'く',
            'su': 'す',
            'tsu': 'つ',
            'nu': 'ぬ',
            'fu': 'ふ',
            'mu': 'む',
            'yu': 'ゆ',
            'ru': 'る',
        };

        this.e = {
            'e': 'え',
            'ke': 'け',
            'se': 'せ',
            'te': 'て',
            'ne': 'ね',
            'he': 'へ',
            'me': 'め',
            're': 'れ',
        };

        this.o = {
            'o': 'お',
            'ko': 'こ',
            'so': 'そ',
            'to': 'と',
            'no': 'の',
            'ho': 'ほ',
            'mo': 'も',
            'ro': 'ろ',
            'wo': 'を',
        };

        this.aDakutenHandakuten = {
            'ga': 'が',
            'za': 'ざ',
            'da': 'だ',
            'ba': 'ば',
            'pa': 'ぱ',
        };

        this.iDakutenHandakuten = {
            'gi': 'ぎ',
            'ji': 'じ',
            'bi': 'び',
            'pi': 'ぴ',
        };

        this.uDakutenHandakuten = {
            'gu': 'ぐ',
            'zu': 'ず',
            'dzu': 'づ',
            'bu': 'ぶ',
            'pu': 'ぷ',
        };

        this.eDakutenHandakuten = {
            'ge': 'げ',
            'ze': 'ぜ',
            'de': 'で',
            'be': 'べ',
            'pe': 'ぺ',
        };

        this.oDakutenHandakuten = {
            'go': 'ご',
            'zo': 'ぞ',
            'do': 'ど',
            'bo': 'ぼ',
            'po': 'ぽ',
        };

        this.aPalatalisated = {
            'kya': 'きゃ',
            'gya': 'ぎゃ',
            'sha': 'しゃ',
            'ja': 'じゃ',
            'cha': 'ちゃ',
            'nya': 'にゃ',
            'hya': 'ひゃ',
            'bya': 'びゃ',
            'pya': 'ぴゃ',
            'rya': 'りゃ',
        };

        this.uPalatalisated = {
            'kyu': 'きゅ',
            'gyu': 'ぎゅ',
            'shu': 'しゅ',
            'ju': 'じゅ',
            'chu': 'ちゅ',
            'nyu': 'にゅ',
            'hyu': 'ひゅ',
            'byu': 'びゅ',
            'pyu': 'ぴゅ',
            'myu': 'みゅ',
            'ryu': 'りゅ',
        };

        this.oPalatalisated = {
            'kyo': 'きょ',
            'gyo': 'ぎょ',
            'sho': 'しょ',
            'jo': 'じょ',
            'cho': 'ちょ',
            'nyo': 'にょ',
            'hyo': 'ひょ',
            'byo': 'びょ',
            'pyo': 'ぴょ',
            'myo': 'みょ',
            'ryo': 'りょ',
        };
    }

}

class Katakana extends Kana {

    constructor() {
        super();
    }

}

module.exports = {Kana, Hiragana, Katakana};
