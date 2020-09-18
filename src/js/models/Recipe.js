import axios from "axios";

let searchReciepe = "https://forkify-api.herokuapp.com/api/get?rId=";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${searchReciepe} ${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      // console.log(res);
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  }

  //calculating time for recipe
  calcTime() {

    // Assuming that we need 15 min for each 3 ingredients

    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }





  parseIngredients() {
    // replacing ui

    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];


    let newIngredients = this.ingredients.map(el => {
      //1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //3. Parse ingredients into count,unit and ingredients
      const arrIng = ingredient.split(" ");

      /*
       The findIndex() method returns the index of the first element in the array that satisfies 
      the provided testing function. Otherwise, it returns -1, indicating that no element passed 
      the test.

      includes() returns true or false
      */
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      // sepration of count ,unit and the ingredient

      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrCount.length === 1) {
          //4 --> count = [4] or 4 - 1/2--> 4+1/2 =5
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          //4 1/2--> count =['4','1/2']
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) {

        objIng = {

          // will use the number in first position
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };

      } else if (unitIndex === -1) {

        objIng = {
          count: 1,
          unit: "",
          ingredient: ingredient,
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }


  updateServings(type) {
    //servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    //Ingredients

    this.ingredients.forEach(el => {
      el.count *= (newServings / this.servings)
    });
    this.servings = newServings;
  }

}