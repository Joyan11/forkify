import uniqueid from 'uniqid'

export default class List {
    constructor() {
        this.items = []
    }


    // adding items to shopping list
    addItem(count, unit, ingredients) {
        const item = {
            id: uniqueid(),
            count,
            unit,
            ingredients
        };

        this.items.push(item);
        return item;
    }

    // delete items from shopping list
    deleteItems(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }


}