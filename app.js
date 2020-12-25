const cardContainer = document.querySelector(".card-container");
const loader = document.querySelector(".loader");
const filterInput = document.getElementById("filter");

let page = 1;

const getPosts = async () => {

    const response = await 
        fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`);

    return response.json();
}

const generatePostsTemplate = posts => posts.map(({
    id,
    title,
    body
}) => {

    return `
        <div class="card">
            <span class="card-number">${id}</span>
            <h4>${title}</h4>
            <p>${body}</p>
        </div>
    `

}).join("");


const addPostsIntoDOM = async () => {

    const posts = await getPosts();
    const postsTemplate = generatePostsTemplate(posts);

    cardContainer.innerHTML += postsTemplate;

}

const getNextPosts = () => {

    setTimeout(() => {
        page += 1;
        addPostsIntoDOM();
    }, 300);

}

const removeLoader = () => {

    setTimeout(() => {
        loader.classList.remove("show");
        getNextPosts();
    }, 2000);

}

const showLoader = () => {

    loader.classList.add("show");
    removeLoader();

}

const handleScrollToPageBottom = () => {
    const {
        clientHeight,
        scrollHeight,
        scrollTop
    } = document.documentElement;
    const isPageBottomAlmostReached =
        scrollTop + clientHeight >= scrollHeight - 10;

    if (isPageBottomAlmostReached) {

        showLoader();

    }
}

const showCardIfMatchInputValue = inputValue => post => {
    
    const postTitle = post.querySelector("h4").textContent.toLowerCase();
    const postBody = post.querySelector("p").textContent.toLowerCase();
    const postContainsInputValue = postTitle.includes(inputValue) ||
    postBody.includes(inputValue);
    
    if (postContainsInputValue) {

        post.style.display = "block";
        return;

    }

    post.style.display = "none";

}

const handleInputValue = event => {

    const inputValue = event.target.value.toLowerCase();
    const posts = document.querySelectorAll(".card");

    posts.forEach(showCardIfMatchInputValue(inputValue));

}

addPostsIntoDOM();

window.addEventListener("scroll", handleScrollToPageBottom);
filterInput.addEventListener("input", handleInputValue);