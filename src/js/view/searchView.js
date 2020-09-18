import {
  elements
} from "./base";

//getting input value and exporting it to controller index.js

export const getInput = () => elements.searchInput.value;

//clearing the inputs

export const clearInput = () => {
  elements.searchInput.value = "";
};

//clearing the results because new query will add html below existing result

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPage.innerHTML = "";
};


export const highlightSelected = id => {
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el => {
    el.classList.remove('results__link--active');
  })

  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

//minimizing the big titles

export const limitRecipeTitle = (title, limit = 18) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    //returning the result
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

//displaying the results on the ui with the help of html

const renderRecipe = (recipe) => {
  const markup = `
    <li class='animate__animated animate__bounceInLeft'>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//creating the button
//data-goto is there because to store the page value of next page/prev page

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto = ${
  type === "prev" ? page - 1 : page + 1
}>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "prev" ? "left" : "right"
        }"></use>
    </svg>
</button>
`;

// which button will appear when

const renderButtons = (page, numberOfPages, resPerPage) => {
  //math.ceil is roud to round number to the next integer - 4.1 = 5 also 4.7 = 5
  const totalPages = Math.ceil(numberOfPages / resPerPage);
  let button;
  if (page === 1 && totalPages > 1) {
    //single button to next page
    button = createButton(page, "next");
  } else if (page < totalPages) {
    //two buttons for forward and backward
    button = `${createButton(page, "prev")}
                ${createButton(page, "next")}
                `;
  } else if (page === totalPages && totalPages > 1) {
    //only backward button
    button = createButton(page, "prev");
  }
  elements.searchResPage.insertAdjacentHTML("afterbegin", button);
};

//getting the results array from the state object state.search.result[array]

export const renderResults = (recipes, page = 1, resPerPge = 10) => {
  //implementing how many results appear on the search page

  const start = (page - 1) * resPerPge;

  const end = page * resPerPge;

  //passing the result array in renderrecipe function
  //Slice start is zero based index slice(1,4) = [1,2,3]

  recipes.slice(start, end).forEach((el) => renderRecipe(el));

  //rendering the pagination in the result page

  renderButtons(page, recipes.length, resPerPge);
};