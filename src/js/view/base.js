export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchButton: document.querySelector('.search'),
    searchResList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list'),
    clearList: document.querySelector('.clear__btn'),
};

export const elementStrings = {
    loader: 'loader'
}

//ading the loader
export const renderLoader = parent => {
    const loader = `
    <div class=${elementStrings.loader}>
        <svg>
            <use href='img/icons.svg#icon-cw'></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader)
}


//removing the loader
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};