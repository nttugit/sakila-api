import db from '../utils/db.js';

const TABLE_NAME = 'film';
const TABLE_ID = 'film_id';

export function findAll() {
    // Không cần async bởi vì trong đây không cần xử lý gì
    return db(TABLE_NAME);
}

export async function findById(id) {
    const list = await db(TABLE_NAME).where(TABLE_ID, id);
    return list.length === 0 ? null : list[0];
}


export function add(category) {
    return db(TABLE_NAME).insert(category);
}


export function del(id) {
    return db(TABLE_NAME).where(TABLE_ID, id).del();
}

export function patch(id, category) {
    return db(TABLE_NAME).where(TABLE_ID, id).update(category);
}