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
        console.log("movies: " + JSON.stringify(clips));
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
}

export function parseClips(contentText: string): Movie[] {
    let text = contentText

    const gridRegexp = /<div class=\"p-contents-grid\">[\s\S]*$/gi
    const gridMatch = gridRegexp.exec(contentText);
    if (gridMatch === null) {
        throw new Error("No grid found")
    }
    // console.log("gridMatch: " + gridMatch[0].slice(0, 100) + '...')
    text = gridMatch[0]

    const movieRegexp = new RegExp([
        '<div class="c-content-item">\\s*',
        '<a class="swiper-no-swiping" href="/movies/(?<id>\\d+)">\\s*',
        '<div[^>]*>\\s*', // <div class="c-content-item__jacket">
        '<img alt="(?<title>[^"]+)"[^>]+src="(?<image>[^"]+)"[^>]+>\\s*',
    ].join(''), 'gi');

    let match;
    const movies: Movie[] = []
    while ((match = movieRegexp.exec(text)) !== null) {
        // console.log("match: " + match[0].slice(0, 100) + '...')
        const movie: Movie = {
            id: parseInt(match.groups["id"]),
            title: match.groups["title"],
            image: match.groups["image"],
        }
        movies.push(movie);
    }
    return movies;
}
