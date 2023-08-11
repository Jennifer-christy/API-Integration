const searchBtn = document.getElementById('search-btn');
const recipesList = document.getElementById('recipes');
const content = document.querySelector('.content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

const getRecipesList = async () => {
  const preloader = document.getElementById("preloader"); 
  recipesList.innerHTML = ""; 

  preloader.style.display = "block"; 

  try {
    const searchInput = document.getElementById("search-input").value.trim();
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
    const response = await data.json();

    const html = response.meals
      ? response.meals.map((meal) => `
        <div class="recipe-item" data-id="${meal.idMeal}">
          <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="'">
          </div>
          <div class="recipe-name">
            <h3>${meal.strMeal}</h3>
            <a href ="#" class="recipe-btn">Get recipe</a>
          </div>
        </div>
      `).join('')
      :`"Sorry, We Couldn't find!"` 
      

    recipesList.classList.toggle("notFound", !response.meals);
    recipesList.innerHTML = html;
  } 
  catch (error) {
    console.error("Error fetching recipes:", error);
    errorMessage.textContent = "An error occurred while fetching recipes. Please try again later.";
  } 
  finally {
    preloader.style.display = "none";
  }
};


const getRecipe = async(e)=>{
  e.preventDefault();

  if(e.target.classList.contains('recipe-btn')){
    let recipeItem =e.target.parentElement.parentElement;
    const data =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeItem.dataset.id}`)
    const response = await data.json();
    mealRecipeModal(response.meals); 
  }
}

const mealRecipeModal =(meal)=>{
  console.log(meal);
  meal= meal[0];
  let html = `
  <h2 class = "title">${meal.strMeal}</h2>
  <p class = "category">${meal.strCategory}</p>
  <div class = "instructions">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
   
  </div>
  <div class = "recipe-meal-img">
    <img src =${meal.strMealThumb} alt = "">
  </div>
  <div class = "recipe-link">
    <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
  </div> 
  `;
  content.innerHTML=html;
  content.parentElement.classList.add('showRecipe');
}


searchBtn.addEventListener('click',getRecipesList);
recipesList.addEventListener('click',getRecipe);
recipeCloseBtn.addEventListener('click',()=>{
  content.parentElement.classList.remove('showRecipe');
 })



