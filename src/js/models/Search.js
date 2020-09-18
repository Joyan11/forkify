import axios from 'axios';

let searchAll = 'https://forkify-api.herokuapp.com/api/search?q=';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const result = await axios(`${searchAll}+${this.query}`);
            //will store the data in the Search object. this points to the search and result creates a new variable
            this.results = result.data.recipes;
            // console.log(this.results)
        } catch (error) {
            alert(error)
        }

    }

}