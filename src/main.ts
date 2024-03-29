function myFunction() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const userIds = getUserIds();
    userIds.forEach(userId => {
        Logger.log("userId: " + userId);

        const user = getUser(userId);
        Logger.log("user.clipPageCount: " + user.clipPageCount);

        const clips: Clip[] = []
        for (let i = 1; i <= user.clipPageCount; i++) {
            const clipsInPage = getClips(userId, i);
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

        newClips.forEach(clip => postToDiscord(user, clip))
        insertToSheet(sheet, newClips)
    });
}

function getUserIds() {
    const users = PropertiesService.getScriptProperties().getProperty("FILMARKS_USERS") || "";
    return users.split(',');
}

type User = {
    userId: string,
    userName: string,
    image: string
    clipPageCount: number
}

function getUser(userId): User {
    const url = 'https://filmarks.com/users/' + userId + '/clips';

    const response = UrlFetchApp.fetch(url);
    const contentText = response.getContentText();

    const {userName, image} = parseProfileContent(contentText)
    const clipPageCount = parsePageCount(contentText);

    return {
        userId, userName, image, clipPageCount
    }
}

export function parseProfileContent(contentText: string): { userName: string, image: string } {
    const regexp = /<div class="p-profile__avator">\s*<img alt="(?<userName>[^"]+)"[^>]+src="(?<image>[^"]+)"[^>]+>\s*/gi;
    const match = regexp.exec(contentText);

    if (match === null || match.groups === undefined) {
        throw new Error('Failed to parse profile content');
    }

    return { userName: match.groups["userName"], image: match.groups["image"] };
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

enum HttpMethod {
    GET = "get",
    DELETE = "delete",
    PATCH = "patch",
    POST = "post",
    PUT = "put"
}

function postToDiscord(user: User, clip: Clip) {
    const discordWebhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");
    if (discordWebhookUrl === null) {
        console.log("discordWebhookUrl is not set")
        return
    }

    const AVATER_URL = 'https://assets.st-note.com/production/uploads/images/9705150/profile_e98e7f099a96991733dcbad9418a1145.jpeg'
    const FILMARKS_YELLOW = '16769280'

    const payload = {
        "content": `${user.userName}さんが観たい映画を追加しました！`,
        "username": "Filmarks",
        "avatar_url": AVATER_URL,
        "embeds": [
            {
                "title": clip.title,
                "url": `https://filmarks.com/movies/${clip.movieId}`,
                "color": FILMARKS_YELLOW,
                "image": {
                    "url": clip.image
                },
                "author": {
                    "name": `@${user.userId}`,
                    "url": `https://filmarks.com/users/${user.userId}`,
                    "icon_url": user.image
                  },
            }
        ],
    }

    const options = {
        "method": HttpMethod.POST,
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify(payload)
    }

    UrlFetchApp.fetch(discordWebhookUrl, options);
}
