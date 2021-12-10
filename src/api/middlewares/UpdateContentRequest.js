const updateContentRequest = async (req, res, next) => {
    const oldContent = req.body;
    const {
        author,
        category,
        chapters,
        totalChapter,
        averageRating,
        thoughts,
        totalThoughts,
        views,
        ...newContent
    } = oldContent;
    console.log(newContent);
    req.body = newContent;
    next();
}

module.exports = updateContentRequest