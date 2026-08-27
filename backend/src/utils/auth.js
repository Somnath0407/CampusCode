const getBearerToken = (req) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;
    return header.slice(7).trim() || null;
};

module.exports = { getBearerToken };
