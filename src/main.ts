function myFunction() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const users = getUsers();
    users.forEach(user => {
        Logger.log("user: " + user);
        const pageCount = getPageCount(user);
        Logger.log("pageCount: " + pageCount);
        const clips: Clip[] = []
        for (let i = 1; i <= pageCount; i++) {
            const clipsInPage = getClips(user, i);
            clips.push(...clipsInPage);
        }
        console.log("clips: " + JSON.stringify(clips));
        console.log("Number of clips: " + clips.length);

        const clipsFromSheet = readFromSheet(sheet)
        console.log("clipsFromSheet: " + JSON.stringify(clipsFromSheet));
        console.log("Number of clips from sheet: " + clipsFromSheet.length);

        const newClips = clips.filter(clip => !clipsFromSheet.some(sheetClip => sheetClip.userId === clip.userId && sheetClip.movieId === clip.movieId));
        console.log("newClips: " + JSON.stringify(newClips));
        console.log("Number of new clips: " + newClips.length);

        insertToSheet(sheet, newClips)
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

export type Clip = {
    userId: string
} & Movie

function getClips(userId: string, page: number): Clip[] {
    const url = 'https://filmarks.com/users/' + userId + '/clips' + '?page=' + page;
    Logger.log("url: " + url);

    const response = UrlFetchApp.fetch(url);
    const contentText = response.getContentText()

    return parseMovies(contentText).map(movie => ({ userId, ...movie }))
}

export type Movie = {
    "movieId": number
    "title": string
    "image": string
}

export function parseMovies(contentText: string): Movie[] {
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
    const clips: Movie[] = []
    while ((match = movieRegexp.exec(text)) !== null) {
        // console.log("match: " + match[0].slice(0, 100) + '...')
        const clip: Movie = {
            movieId: parseInt(match.groups["id"]),
            title: match.groups["title"],
            image: match.groups["image"],
        }
        clips.push(clip);
    }
    return clips;
}

function readFromSheet(sheet): Clip[] {
    const data = sheet.getDataRange().getValues();
    const clips: Clip[] = [];
    for (let i = 0; i < data.length; i++) {
        const clip: Clip = {
            userId: data[i][0],
            movieId: data[i][1],
            title: data[i][2],
            image: data[i][3]
        }
        clips.push(clip);
    }
    return clips;
}

function insertToSheet(sheet, clips: Clip[]) {
    const now = new Date().toISOString();
    const lastRow = sheet.getLastRow() + 1;
    clips.forEach((clip, index) => {
        const row = lastRow + index;
        sheet.getRange(`A${row}`).setValue(clip.userId);
        sheet.getRange(`B${row}`).setValue(clip.movieId);
        sheet.getRange(`C${row}`).setValue(clip.title);
        sheet.getRange(`D${row}`).setValue(clip.image);
        sheet.getRange(`E${row}`).setValue(now);
    });
}
