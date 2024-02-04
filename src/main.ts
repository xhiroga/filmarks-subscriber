function myFunction() {
    const users = getUsers();
    users.forEach(user => {
        Logger.log("user: " + user);
        const pageCount = getPageCount(user);
        Logger.log("pageCount: " + pageCount);
        const clips: Movie[] = []
        for (let i = 1; i <= pageCount; i++) {
            const clipsInPage = getClips(user, i);
            clips.push(...clipsInPage);
        }
        Logger.log("movies: " + clips);
    });
}

function getUsers() {
    const users = PropertiesService.getScriptProperties().getProperty("FILMARKS_USERS") || "";
    return users.split(',');
}

function getPageCount(userId) {
    const url = 'https://filmarks.com/users/' + userId + '/clips';

    const response = UrlFetchApp.fetch(url);
    const contentText = response.getContentText();

    return parsePageCount(contentText);
}

export function parsePageCount(contentText: string) {
    const myRegexp = /<li class=\"p-users-navi__item p-users-navi__item--clips[\s\S]*?\">[\s\S]*?<span class=\"p-users-navi__count\">([\d]+)<\/span>/gi;
    const match = myRegexp.exec(contentText);
    if (!match) {
        throw new Error('Failed to parse page count');
    }

    const itemCount = match[1];
    const pageCount = Math.ceil(parseInt(itemCount) / 36);
    return pageCount;
}

function getClips(userId: string, page: number): Movie[] {
    const url = 'https://filmarks.com/users/' + userId + '/clips' + '?page=' + page;
    Logger.log("url: " + url);

    const response = UrlFetchApp.fetch(url);
    const contentText = response.getContentText()

    // DEBUG
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const maxChars = 40000;
    for (let i = 0; i < contentText.length; i += maxChars) {
        const cell = sheet.getRange("A" + (i / maxChars + 1));
        cell.setValue(contentText.slice(i, i + maxChars));
    }

    return parseClips(contentText)
}

export type Movie = {
    "id": number
    "title": string
    "image": string
    "marks": number
    "clips": number
    "star": string
}

export function parseClips(contentText: string): Movie[] {
    let text = contentText

    const gridRegexp = /<div class=\"p-contents-grid\">[\s\S]*$/gi
    const gridMatch = gridRegexp.exec(contentText);
    if (gridMatch === null) {
        console.error("No grid found.")
        return []
    }
    console.debug("gridMatch: " + gridMatch[0].slice(0, 100) + '...')
    text = gridMatch[0]

    const movieRegexp = new RegExp([
        '<div class="c-content-item">\\s*',
        '<a class="swiper-no-swiping" href="/movies/(\\d+)">\\s*',
        '<div[^>]*>\\s*', // <div class="c-content-item__jacket">
        '<img alt="([^"]+)"[^>]+src="([^"]+)"[^>]+>\\s*',
        '</div>\\s*',
        '</a>\\s*',
        '<h3[^>]*>\\s*',
        '<a.+\\s*', // <a class="swiper-no-swiping" href="/movies/53308">そして父になる</a>
        '</h3>\\s*',

        '<div class="c-content-item-infobar">\\s*',
        '<div[^>]*>\\s*',
        '<div[^>]*>\\s*',
        '<a[^>]*>\\s*',
        '<span class="c-content-item-infobar__body">(\\d+)</span>\\s*',
        '</a>\\s*',
        '.+\\s*', // <!----><!---->
        '</div>\\s*',
        '</div>\\s*',

        '<div[^>]*>\\s*',
        '<div[^>]*>\\s*',
        '<a[^>]*>\\s*',
        '<span class="c-content-item-infobar__body">(\\d+)</span>\\s*',
        '</a>\\s*',
        '</div>\\s*',
        '</div>\\s*',

        '<div[^>]*>\\s*',
        '<a[^>]*>\\s*',
        '<span class="c-content-item-infobar__body">(\\S+)</span>',
    ].join(''), 'gi');

    let match;
    const movies: Movie[] = []
    while ((match = movieRegexp.exec(text)) !== null) {
        console.debug("match: " + match[0].slice(0, 100) + '...')
        const movie: Movie = {
            id: parseInt(match[1]),
            title: match[2],
            image: match[3],
            marks: parseInt(match[4]),
            clips: parseInt(match[5]),
            star: match[6]
        }
        movies.push(movie);
    }
    return movies;
}
