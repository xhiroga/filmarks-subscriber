function myFunction() {
    const users = getUsers();
    users.forEach(user => {
        Logger.log("user: " + user);
        const pageCount = getPageCount(user);
        Logger.log("pageCount: " + pageCount);
        const clips: Movie[] = []
        for(let i = 1; i <= pageCount; i++) {
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
    const url = 'https://filmarks.com/users/' + userId + '?page=' + page;
    Logger.log(url);

    const response = UrlFetchApp.fetch(url);
    const contentText = response.getContentText()
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
    const movieRegexp = new RegExp([
        '<div class="c-content-item">',
        '[\\s\\S]*?',
        '<a class="swiper-no-swiping" href="/movies/(?<id>\\d+)">',
        '[\\s\\S]*?',
        '<img alt="(?<title>[^"]+)"[\\s\\S]*?src="(?<image>[^"]+)"',
        '[\\s\\S]*?',
        '<div class="js-btn-mark"[\\s\\S]*?>',
        '[\\s\\S]*?',
        '<span class="c-content-item-infobar__body">(?<marks>\\d+)</span>',
        '[\\s\\S]*?',
        '<div class="js-btn-clip"[\\s\\S]*?>',
        '[\\s\\S]*?',
        '<span class="c-content-item-infobar__body">(?<clips>\\d+)</span>',
        '[\\s\\S]*?',
        '<div class="c-content-item-infobar__item c-content-item-infobar__item--star">',
        '[\\s\\S]*?',
        '<span class="c-content-item-infobar__body">(?<rate>\\S+)</span>',
    ].join(''), 'gi');
    let match;
    const movies: Movie[] = [];
    while ((match = movieRegexp.exec(contentText)) !== null) {
        const movie: Movie = {
            id: parseInt(match.groups['id']),
            title: match.groups['title'],
            image: match.groups['image'],
            marks: parseInt(match.groups['marks']),
            clips: parseInt(match.groups['clips']),
            star: match.groups['rate']
        }
        movies.push(movie);
    }
    return movies;
}
