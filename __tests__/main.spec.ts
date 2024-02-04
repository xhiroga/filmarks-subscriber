import { Movie, parseClips, parsePageCount } from '../src/main';

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
            id: 53308,
            title: "そして父になる",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/j70q3kxa2f1gkpbxep6hk12izs3v/23375.jpg",
            marks: 114991,
            clips: 25699,
            star: "3.7"
        }, {
            id: 58836,
            title: "マイ・インターン",
            image: "https://d2ueuvlup6lbue.cloudfront.net/variants/production/store/fitpad/300/400/uy90xszm4zb777aedhdes577b9d4/29102.jpg",
            marks: 343063,
            clips: 121201,
            star: "4.1"
        }]
        expect(parseClips(contentText)).toStrictEqual(expected);
    })
})
