import db from '../utils/db.js';


export function findAll() {
    // Không cần async bởi vì trong đây không cần xử lý gì
    return db('category');
}

export async function findById(id) {
    const list = await db('category').where('category_id', id);
    return list.length === 0 ? null : list[0];
}


export function add(category) {
    return db('category').insert(category);
}


export function del(id) {
    return db('category').where('category_id', id).del();
}

export function patch(id, category) {
    return db('category').where('category_id', id).update(category);
}