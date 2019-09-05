module.exports = function() {
    return {
        visitor: {
            Identifier() {
                console.log("here is identifier");
            }
        }
    }
}