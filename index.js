const TITLE_LENGTH_LIMIT = 30;
const MIN_TITLE_LENGTH_LIMIT = 0;

const inputNode = document.querySelector('.form__input');//поле ввода
const addBtnNode = document.querySelector('.movie__add-btn');//кнопка добавить
const moviesListNode = document.querySelector('.movies__list');//список фильмов

const CHECKED_CLASS_NAME = 'movie__item_checked';//пометка для чека фильма
const STORAGE_LABEL_TASKS = 'moviesList'; //пометка для сохранение в локальное хранилище

let movieList = [];//массив с задачими
const storageNode = localStorage;

//Функции

const getMovieName = () => {//функция получения задачи
    const input = inputNode.value;
    return input;
};

const clearInput = () => {//функция очистки инпута
    inputNode.value = "";
};

inputNode.addEventListener('input', () => {//проверка колличества символов
    validationInput();
});

validationInput = () => {
    const inputLen = inputNode.value.trim().length;
    if (inputLen != 0 || inputLen > MIN_TITLE_LENGTH_LIMIT) {
        if (inputLen <= MIN_TITLE_LENGTH_LIMIT) {
            addBtnNode.disabled = true;
            return;
        }
        if (inputLen > TITLE_LENGTH_LIMIT) {
            addBtnNode.disabled = true;
            return;
        } else {
            addBtnNode.disabled = false;
        }
    } else {
        addBtnNode.disabled = true;//отключение кнопки добавления если поле ввода пустое
    };
};

const deleteMoviesFromStorage = () => {
    storageNode.removeItem(STORAGE_LABEL_TASKS);
};
const saveMoviesToStorage = () => {//сохранение в LocalStorage
    const movieListStorage = JSON.stringify(movieList);
    storageNode.setItem(STORAGE_LABEL_TASKS, movieListStorage);
};
const loadMoviesFromStorage = () => {
    const movieListStorage = storageNode.getItem(STORAGE_LABEL_TASKS);
    if (movieListStorage) {
        movieList = JSON.parse(movieListStorage); 
    } else {
        movieList = [];
    }
    render(movieList);
};
window.addEventListener('load', loadMoviesFromStorage);//вызов из localStorage при загрузки 

const createMovie = (movieName) => {//создание списка задач
    const movie = { 
        title: movieName,
        id: `${Math.random()}`,
        active: true
    };
    movieList.push(movie);
    saveMoviesToStorage();
    render(movieList);
    return movie;
};

const render = (movieList) => {
    moviesListNode.innerHTML = "";
    movieList.forEach((movie) => {//массив задач
        const movieItem = document.createElement("li");
        const movieBox = document.createElement("div");
        const movieCheckbox = document.createElement("input");
        const movieLabel = document.createElement("label");
        const movieCloseBtn = document.createElement("button");

        movieItem.className = "movie__item";//элемент
        movieBox.className = "movie__box";//контейнер
        movieCheckbox.className = "movie__checkbox";//чекбокс
        movieLabel.className = "movie__label";//название
        movieCloseBtn.className = "movie__close-btn";//кнопка удаления

        (movie.active === true) ? movieCheckbox.checked = false:
		movieCheckbox.checked = true

        movieLabel.innerText = movie.title;

        movieItem.dataset.id = movie.id;
        movieCheckbox.id = `${Math.random()}`;
        movieCheckbox.setAttribute("type", "checkbox");
        movieLabel.setAttribute("for", `${movieCheckbox.id}`);
        movieCloseBtn.dataset.id = movie.id;

        moviesListNode.appendChild(movieItem);
        movieItem.appendChild(movieBox);
        movieBox.appendChild(movieCheckbox);
        movieBox.appendChild(movieLabel);
        movieItem.appendChild(movieCloseBtn);

        movieCloseBtn.addEventListener("click", () => {
        const id = movieItem.dataset.id;
        CloseMovie(movieList, id);
        deleteMoviesFromStorage();
        });
    });
};
//Удаление задачи
const CloseMovie = (movieList, id) => {
    let index = -1;
    for (let i = 0; i < movieList.length; i++) {
      if (movieList[i].id === id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      movieList.splice(index, 1);
      render(movieList);
      saveMoviesToStorage();
      deleteMoviesFromStorage();
    }
};
  
//Обработчик событий

const addBtnHandler = () => {
    const movieName = getMovieName();
    clearInput();
    validationInput();
    createMovie(movieName);
    render(movieList);
    saveMoviesToStorage();
};

const activeCheckbox = (e) => {// активация чекбокса
    if (e.target.classList.contains('movie__checkbox') ||
        e.target.classList.contains('movie__box')) {
        const movieItem = e.target.closest('.movie__item');
        
        const movieId = movieItem.dataset.id;
        const movieIndex = movieList.findIndex(movie => movie.id === movieId);
        if (movieIndex !== -1) {
            movieList[movieIndex].active = !movieList[movieIndex].active;
        }
    }
    saveMoviesToStorage();
};

if(Array.isArray(movieList)) {}
const init = () => {
	render(movieList);
}
init();
//Слушатель событий
addBtnNode.addEventListener('click', addBtnHandler);
moviesListNode.addEventListener('click', activeCheckbox);