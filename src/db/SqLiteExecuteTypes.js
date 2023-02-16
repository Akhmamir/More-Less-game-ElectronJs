const { QueryTypes } = require('sequelize');

const SqLiteExecuteTypes = {
    SELECT: QueryTypes.SELECT,
    INSERT: QueryTypes.INSERT,
    UPDATE: QueryTypes.UPDATE,
};

module.exports = {
    SqLiteExecuteTypes,
};