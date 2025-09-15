/*
Storage utility for managing data in localStorage.
*/
const Storage = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    add(key, item) {
        let items = this.get(key);
        items.push(item);
        this.set(key, items);
    },
    update(key, id, updatedItem) {
        let items = this.get(key);
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = updatedItem;
            this.set(key, items);
        }
    },
    delete(key, id) {
        let items = this.get(key);
        items = items.filter(i => i.id !== id);
        this.set(key, items);
    },
    getById(key, id) {
        const items = this.get(key);
        return items.find(i => i.id === id);
    }
};
