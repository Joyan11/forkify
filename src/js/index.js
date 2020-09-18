import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes"
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView"
import * as likeView from "./view/likeView"
import {
  elements,
  renderLoader,
  clearLoader
} from "./view/base";


const state = {

};


// console.log(state);



/*

SEARCH CONTROLLER

*/



const controlSearch = async () => {
  //get query from Searchview
  const query = searchView.getInput();
  // console.log(query);
  if (query) {
    //new search object and adding it to state
    state.search = new Search(query);

    //prepare ui for results
    searchView.clearInput();

    //will clear the result during the search for every time the search button is pressed
    searchView.clearResults();

    renderLoader(elements.searchResult);

    try {
      //search for recipe
      await state.search.getResult();

      clearLoader();
      //render result to ui
      searchView.renderResults(state.search.results);
      //console.log(state.search.results);
    } catch (err) {
      alert(err);
      clearLoader();
    }
  }
};

/* 

Search Button event handler

*/

//dom imported from base.js
elements.searchButton.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});


/*

Search result page buttons EVent handling

*/

//usng event delegation because the page buttons are no available when the application is loaded
elements.searchResPage.addEventListener("click", (e) => {

  //closest is used to get the class closest to the parent element
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

  let btn = e.target.closest(".btn-inline");

  // console.log(btn);

  if (btn) {
    //The dataset read-only property of the HTMLOrForeignElement interface provides-
    //read/write access to all the custom data attributes (data-*) set on the element
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});







/*

RECIPE CONTROLLER

*/

const controlRecepi = async () => {
  const id = window.location.hash.replace("#", "");
  // console.log(id);

  if (id) {

    //prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    if (state.search) {
      searchView.highlightSelected(id);
    }


    //creating recipe object
    state.recipe = new Recipe(id);

    try {

      //get recipe data
      await state.recipe.getRecipe();
      // console.log(state.recipe);

      state.recipe.parseIngredients();

      //calc time calc servings
      state.recipe.calcServings();
      state.recipe.calcTime();

      //render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      // console.log(state.recipe);
      // console.log(state);

    } catch (err) {

      alert("error processing recipe");
    }


  }
};



/*

  Event for getting recipe details

*/



// The hashchange event is fired when the fragment identifier of the URL has changed

/*The load event is fired when the whole page has loaded,
 including all dependent resources such as stylesheets and images.*/

//window.addEventListener('hashchange',controlRecepi);

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecepi)
);


/* 

List controller

*/

const controlList = () => {
  // create list if none is present
  if (!state.list) state.list = new List();

  //adding ingredients to the list and ui
  const item = state.recipe.ingredients.forEach(el => {
    let item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });

}


/* 

Likes controller

*/

const controlLikes = () => {

  // will check if the list object is created
  if (!state.likes) state.likes = new Likes();

  const currentId = state.recipe.id;
  // console.log(currentId);


  if (!state.likes.isLiked(currentId)) {

    //add like to the state
    const newLike = state.likes.addLikes(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //after pushing the array in Likes.js it will be stored as state.likes.likes = [{data},{data}]


    //toggle likes button
    likeView.toggle(true);
    //add likes to the ui list
    likeView.renderLikes(newLike);
  } else {
    //remove like to the state
    state.likes.deleteLikes(currentId);
    //toggle likes button
    likeView.toggle(false);
    //remove likes to the ui list
    likeView.deleteLike(currentId);
  }

}


window.addEventListener('load', () => {

  //creating object after page reload
  state.likes = new Likes();

  //loading likes from storage
  state.likes.reloadLikes();

  //toggle the lives view
  likeView.toggleLikesMenu(state.likes.getNumLikes());
  // console.log(state.likes)
  //render the likes view
  state.likes.likes.forEach(like => likeView.renderLikes(like));
})

/*

EVents for handling things inside recipe details

*/

// buttons for servings
// we're using matches() because have multiple things to select in ".recipe"
// * used to match any child element of btn
// we need event delegation because certain elementsare not loaded yet

elements.recipe.addEventListener('click', e => {
  // console.log(e.target);

  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      // decrease servings when button is clicked
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase servings when button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    //Add ingredients to shopping list
    delete state.list;
    listView.clearList();
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {

    controlLikes();
  }
  // console.log(state.recipe)
});







// handle delete and update events in shopping list

elements.shopping.addEventListener('click', e => {
  // console.log(e.target);
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // console.log(id)
  if (e.target.matches('.shopping__delete,.shopping__delete *')) {
    // console.log(e.target);
    state.list.deleteItems(id);
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping-cart-value,.shopping-cart-value *')) {

    const val = parseInt(e.target.value);
    state.list.updateCount(id, val)
  }

})



// window.l = new List();