export default class Likes {
    constructor() {
        this.likes = [];
    }


    addLikes(id, title, author, img) {

        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);
        this.persistData();
        return like;
    }


    deleteLikes(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    }


    //will return true if -1 is not present
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    //used to store data in localstoage
    //json.stringify will convest data structure to a string
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    //restore from local storage
    //JSON.parse will convert json string to the old datastructure
    reloadLikes() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}