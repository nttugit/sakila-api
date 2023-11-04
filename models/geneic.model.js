import db from '../utils/db.js';
import moment from 'moment';

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

        async findWithPolling(ts) {
            const mts = moment.unix(ts);
            const mtsStr = mts.format('YYYY-MM-DD HH:mm:ss');
            return db.from(tableName).where('last_update', '>=', mtsStr);
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

        async addAndReturn(entity) {
            return db(tableName)
                .insert(entity)
                .returning('*')
                .then((insertedObjects) => {
                    // The insertedObjects variable contains the newly inserted object data
                    console.log('Inserted Object:', insertedObjects);
                    return insertedObjects;
                })
                .catch((error) => {
                    console.error('Error inserting object:', error);
                });
        },

        del(id) {
            return db(tableName).where(tableId, id).del();
        },

        patch(id, entity) {
            return db(tableName).where(tableId, id).update(entity);
        },
        count(conditions) {
            return db(tableName).where(conditions).count().first();
        },
    };
}
