const pagination = (req) => {
    const pageNo = (req.query['page']) ? req.query['page'] : 1;
    const sortBy = (req.query['sort_by']) ? req.query['sort_by'] : 'createdAt';
    const order = (req.query['order']) ? req.query['order'] : 'asc';
    const limit = process.env.page_limit * 1;
    const skip = (pageNo - 1) * limit;
    return {skip, limit, sortBy, order};
}

const includes = (req) => {
    if (req.query['include']) {
        return req.query['include'].toString().replace('_', ' ');
    } else {
        return null;
    }
}

module.exports = {
    pagination,
    includes
}