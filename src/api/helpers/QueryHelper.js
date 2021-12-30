const pagination = (req) => {
    const pageNo = (req.query['page']) ? req.query['page'] : 1;
    const sortBy = (req.query['sort_by']) ? req.query['sort_by'] : 'createdAt';
    const order = (req.query['order']) ? req.query['order'] : 'desc';
    const limit = process.env.page_limit * 1;
    const skip = (pageNo - 1) * limit;
    return {skip, limit, sortBy, order};
}

const filter = (req) => {
    let filterObj = {};
    const catId = req.query['category'];
    const author = req.query['author'];

    if (catId)
        filterObj['category'] = catId;
    if (author)
        filterObj['author'] = author;

    return filterObj;
}

const includes = (req) => {
    if (req.query['include']) {
        return req.query['include'].toString().replace('_', ' ');
    } else {
        return null;
    }
}

const shouldPopulate = req => {
    if (req.query['populate']) {
        const p = req.query['populate'];
        return (p === 'true' || p === '1');

    } else {
        return true;
    }

}

module.exports = {
    pagination,
    includes,
    shouldPopulate,
    filter
}