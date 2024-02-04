import * as fs from 'fs';
import * as path from 'path';
import { Movie, parseMovies, parsePageCount, parseProfileContent } from '../src/main';

describe('parseProfileElement', () => {
    it('should parse profile content', () => {
        const contentText = `
            <div class="p-profile__content">
                <div class="p-profile__avator">
                    <img alt="小笠原寛明" fileanme="_" src="https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fill/100/100/e30muzntectait11dk9nqjyp470d/profileImage.png" width="100" height="100">
                </div>
        `
        const expected = {
            userName: "小笠原寛明",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fill/100/100/e30muzntectait11dk9nqjyp470d/profileImage.png"
        }
        expect(parseProfileContent(contentText)).toStrictEqual(expected);
    })
    it('should parse from full HTML', () => {
        const contentText = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const expected = {
            userName: "小笠原寛明",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fill/100/100/e30muzntectait11dk9nqjyp470d/profileImage.png"
        }
        expect(parseProfileContent(contentText)).toStrictEqual(expected);
    })
})

describe('parsePageCount', () => {
    it('should parse page count', () => {
        const contentText = `
            <li class="p-users-navi__item p-users-navi__item--clips is-active">
                <div class="p-users-navi__container">
                    <span class="p-users-navi__count">1000</span>
                    <span class="p-users-navi__text">Clips</span>
                </div>
            </li>
        `;
        expect(parsePageCount(contentText)).toBe(28);
    });
});

describe('parseClips', () => {
    it('should parge clips', () => {
        const contentText = `
            <div class="p-contents-grid">
                <div class="c-content-item">
                    <a class="swiper-no-swiping" href="/movies/53308">
                        <div class="c-content-item__jacket">
                            <img alt="そして父になる" filename="_" src="https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/j70q3kxa2f1gkpbxep6hk12izs3v/23375.jpg" width="150" height="200">
                        </div>
                    </a>
                    <h3 class="c-content-item__title">
                        <a class="swiper-no-swiping" href="/movies/53308">そして父になる</a>
                    </h3>
                    <div class="c-content-item-infobar">
                        <div class="js-btn-mark" data-is-recommend="false" data-mark="{&quot;active&quot;:&quot;false&quot;,&quot;movie_id&quot;:53308,&quot;id&quot;:null,&quot;count&quot;:114991,&quot;social&quot;:{&quot;FacebookProfile&quot;:&quot;true&quot;,&quot;TwitterProfile&quot;:&quot;true&quot;}}" data-v-app="">
                            <div class="c-content-item-infobar__item c-content-item-infobar__item--marks">
                                <a href="">
                                    <span class="c-content-item-infobar__body">114991</span>
                                </a>
                                <!----><!---->
                            </div>
                        </div>
                        <div class="js-btn-clip" data-clip="{&quot;active&quot;:&quot;true&quot;,&quot;movie_id&quot;:53308,&quot;id&quot;:130709904,&quot;count&quot;:25699}" data-v-app="">
                            <div class="is-active c-content-item-infobar__item c-content-item-infobar__item--clips">
                                <a class="" href="">
                                    <span class="c-content-item-infobar__body">25699</span>
                                </a>
                            </div>
                        </div>
                        <div class="c-content-item-infobar__item c-content-item-infobar__item--star">
                            <a class="swiper-no-swiping" href="/movies/53308">
                                <span class="c-content-item-infobar__body">3.7</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="c-content-item">
                    <a class="swiper-no-swiping" href="/movies/58836">
                        <div class="c-content-item__jacket">
                            <img alt="マイ・インターン" filename="_" src="https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/uy90xszm4zb777aedhdes577b9d4/29102.jpg" width="150" height="200">
                        </div>
                    </a>
                    <h3 class="c-content-item__title">
                        <a class="swiper-no-swiping" href="/movies/58836">マイ・インターン</a>
                    </h3>
                    <div class="c-content-item-infobar">
                        <div class="js-btn-mark" data-is-recommend="false" data-mark="{&quot;active&quot;:&quot;false&quot;,&quot;movie_id&quot;:58836,&quot;id&quot;:null,&quot;count&quot;:343063,&quot;social&quot;:{&quot;FacebookProfile&quot;:&quot;true&quot;,&quot;TwitterProfile&quot;:&quot;true&quot;}}" data-v-app="">
                            <div class="c-content-item-infobar__item c-content-item-infobar__item--marks">
                                <a href="">
                                    <span class="c-content-item-infobar__body">343063</span>
                                </a>
                                <!----><!---->
                            </div>
                        </div>
                        <div class="js-btn-clip" data-clip="{&quot;active&quot;:&quot;true&quot;,&quot;movie_id&quot;:58836,&quot;id&quot;:63554653,&quot;count&quot;:121201}" data-v-app="">
                            <div class="is-active c-content-item-infobar__item c-content-item-infobar__item--clips">
                                <a class="" href="">
                                    <span class="c-content-item-infobar__body">121201</span>
                                </a>
                            </div>
                        </div>
                        <div class="c-content-item-infobar__item c-content-item-infobar__item--star">
                            <a class="swiper-no-swiping" href="/movies/58836">
                                <span class="c-content-item-infobar__body">4.1</span>
                            </a>
                        </div>
                    </div>
                </div>
        `
        const expected: Movie[] = [{
            movieId: 53308,
            title: "そして父になる",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/j70q3kxa2f1gkpbxep6hk12izs3v/23375.jpg",
        }, {
            movieId: 58836,
            title: "マイ・インターン",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/uy90xszm4zb777aedhdes577b9d4/29102.jpg",
        }]
        expect(parseMovies(contentText)).toStrictEqual(expected);
    })

    it('should parge clips from full HTML', () => {
        const contentText = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        console.debug('contentText: ' + contentText.slice(0, 100) + '...')
        const expected: Movie[] = [{
            movieId: 53308,
            title: "そして父になる",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/j70q3kxa2f1gkpbxep6hk12izs3v/23375.jpg",
        }, {
            movieId: 58836,
            title: "マイ・インターン",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/uy90xszm4zb777aedhdes577b9d4/29102.jpg",
        }, {
            "movieId": 14850,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/qdln23uu8ppjvzz9r4edtl2qfbi0/8483.jpg",
            "title": "東京裁判",
        }, {
            "movieId": 83796,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/exi19x85f6xkbu2j8r8vkfy9ph8r/83796____.jpg",
            "title": "パラサイト 半地下の家族",
        }, {
            "movieId": 85106,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/tbn2llnf08lem6y3qcaiv03z4egz/85106.jpg",
            "title": "少年の君",
        }, {
            "movieId": 58614,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/hh8rxv5mftgb7u893wafbu9sflp0/25910.jpg",
            "title": "シェフ 三ツ星フードトラック始めました",
        }, {
            "movieId": 91365,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/8dgsy09r0tqa7av58qpibpuz8z07/91365.jpg",
            "title": "ハミルトン",
        }, {
            "movieId": 21258,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/u4h9m80gifv1c8cdvltw5v452bzu/51M303-2BkqyL.jpg",
            "title": "ライフ・イズ・ビューティフル",
        }, {
            "movieId": 64560,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/v5481rsa4swldhvan6e5v7nhz6wd/64560.jpg",
            "title": "ナショナル・シアター・ライヴ 2016「夜中に犬に起こった奇妙な事件」",
        }, {
            "movieId": 64561,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/fiam8y0xkzdp0802xlcabksnjo8k/31063.jpg",
            "title": "ナショナル・シアター・ライヴ 2016「橋からの眺め」",
        }, {
            "movieId": 34444,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/alzuidqmf8m3o0ws72o6ymoqn8ba/36180.jpg",
            "title": "アメリ",
        }, {
            "movieId": 30757,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/4ytfd3jx83mwgdv2dk4zdhvuk0kv/530.jpg",
            "title": "麗しのサブリナ",
        }, {
            "movieId": 69145,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/6h7mj3sqhk395ty79cfjbqr3vxgu/69145.jpg",
            "title": "僕のワンダフル・ライフ",
        }, {
            "movieId": 6245,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/n9nih4ciwx7erl8ldft8e8i262u4/1904.jpg",
            "title": "ジーザス・クライスト・スーパースター",
        }, {
            "movieId": 68144,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/krnbqo2bxw9iqhc242xslnq168lb/68144.jpg",
            "title": "ライ麦畑の反逆児 ひとりぼっちのサリンジャー",
        }, {
            "movieId": 2151,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/eygwqcvzhuw90c1cmfc9pgbg2ts8/12810.jpg",
            "title": "プラダを着た悪魔",
        }, {
            "movieId": 60214,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/ju3bkdbvskltii16erqhiwr79xau/27562.jpg",
            "title": "グッド・ストライプス",
        }, {
            "movieId": 67547,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/0yxgq38o1auz969p69ph3ij3mald/32362.jpg",
            "title": "奇跡の教室 受け継ぐ者たちへ",
        }, {
            "movieId": 36828,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/7ucsr5zxozsxgdp1exszh7k7glyx/51H0Bx3Ou-2BL.jpg",
            "title": "ローマの休日",
        }, {
            "movieId": 56354,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/7vmgbp9md7cjraa3px47ccbyrvg1/24352.jpg",
            "title": "アバウト・タイム 愛おしい時間について",
        }, {
            "movieId": 64234,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/clgxov3b4627rbzllvqfkwjv0017/64234.jpg",
            "title": "オンネリとアンネリのふゆ",
        }, {
            "movieId": 77708,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/46eczlxuw78wzwoqeen1tiejnbhs/77708.jpg",
            "title": "オンネリとアンネリのおうち",
        }, {
            "movieId": 70222,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/78xhl1lmv5jc4rkj2xuylsgoslfc/s_70222+%E3%81%AE%E3%82%B3%E3%83%92%E3%82%9A%E3%83%BC.jpg",
            "title": "ムーンライト",
        }, {
            "movieId": 32354,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/cdomb6qwq4u31721x9o52015gug7/%E7%B4%85%E3%81%AE%E8%B1%9A.jpg",
            "title": "紅の豚",
        }, {
            "movieId": 62772,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/bc7lcatpf29ff56jy32eygkn2fxc/36190.jpg",
            "title": "湯を沸かすほどの熱い愛",
        }, {
            "movieId": 80582,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/zuh7tkci5j38bewmrzrl55da3019/80582.jpg",
            "title": "グリーンブック",
        }, {
            "movieId": 18695,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/ou732d03u7ia41lali3kcde0lnce/8840.jpg",
            "title": "書を捨てよ町へ出よう",
        }, {
            "movieId": 30359,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/b4lijrka4eehgt6bcw36phk5mqp6/61BLuNiUMZL.jpg",
            "title": "百万円と苦虫女",
        }, {
            "movieId": 4186,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/9rbtzfta14h9pzijzpquoste9va8/%E3%82%82%E3%81%AE%E3%81%AE%E3%81%91%E5%A7%AB.jpg",
            "title": "もののけ姫",
        }, {
            "movieId": 69870,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/mmq4wexdq0rb2n4niykk3ewlddmn/69870.jpg",
            "title": "君の名前で僕を呼んで",
        }, {
            "movieId": 60411,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/kbk29xhiuvsqbpaeavdnhxl7j8xh/60411_.jpg",
            "title": "ブラックパンサー",
        }, {
            "movieId": 56684,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/t3zv8r7stduuutrw7ylo8qmfkckm/24543.jpg",
            "title": "シンプル・シモン",
        }, {
            "movieId": 77796,
            "image": "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/07yjufqdj2ehzce35n3eycw2npgh/%E8%8D%B3%E3%83%BB%EF%BD%BC%E8%BC%94%E2%80%B3%E8%9E%B3%EF%BD%B6%E8%AD%8C%E6%9F%94%E7%B9%9D%E6%98%B4%E3%81%9B%E7%B9%A7%EF%BD%BF%E7%B9%9D%EF%BD%BC.jpg",
            "title": "万引き家族",
        },
        ]
        expect(parseMovies(contentText)).toStrictEqual(expected);
    })
})
