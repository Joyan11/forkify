import {
    elements
} from './base';


export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
    <div class="shopping__count" >
        <input type="number" min='1' value="${item.count}" step="${item.count}" class='shopping-cart-value'>
        <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredients}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
</li>
    `
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}


// we get the id to delete the item
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid='${id}']`);
    if (item) item.parentElement.removeChild(item);
}

export const clearList = () => {
    elements.shopping.innerHTML = "";
};