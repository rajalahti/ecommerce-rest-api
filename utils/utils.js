const utils = {};

utils.generateInteger = () => {
    const max = 2147483647;
    return Math.floor((Math.random()*max));
};

module.exports = utils;