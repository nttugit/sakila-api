import db from '../utils/db.js';

export default function (tableName, tableId) {
    return {
        findAll() {
            // Không cần async bởi vì trong đây không cần xử lý gì
            return db(tableName);
        },

        find(pagination = {}, conditions = {}) {
            const offset = pagination.page * pagination.size - pagination.size;
            return db
                .from(tableName)
                .where(conditions)
                .offset(offset)
                .limit(pagination.size);
        },
        async findOne(conditions = {}) {
            // console.log('conditions', conditions);
            return db.from(tableName).where(conditions).first();
        },
        async findById(id) {
            const list = await db(tableName).where(tableId, id);
            return list.length === 0 ? null : list[0];
        },

        async add(entity) {
            return db(tableName).insert(entity);
        },

        del(id) {
            return db(tableName).where(tableId, id).del();
        },

        patch(id, entity) {
            return db(tableName).where(tableId, id).update(entity);
        },
    };
}
