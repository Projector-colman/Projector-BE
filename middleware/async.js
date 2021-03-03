// This middleware creates an async function template for routes to use.
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (e) {
            next(e);
        }
    };
}