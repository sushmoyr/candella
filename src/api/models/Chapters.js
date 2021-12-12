class BaseChapter {
    author;
    category;
    chapterName;
    contentId;


    constructor(author, category, chapterName, contentId) {
        this.author = author;
        this.category = category;
        this.chapterName = chapterName;
        this.contentId = contentId;
    }
}

class TextChapter extends BaseChapter {
    body;

    constructor(author, category, chapterName, contentId, body) {
        super(author, category, chapterName, contentId);
        this.body = body;
    }
}


const getChapter = (category) => {

}

module.exports = getChapter