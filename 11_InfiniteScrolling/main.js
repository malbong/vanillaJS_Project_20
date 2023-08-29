document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const pageSize = 5;

  const main = document.querySelector("main");
  const filter = document.querySelector("#filter");

  const loaderContainer = document.querySelector(".loader-container");

  const getPosts = async function () {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${pageSize}`
      );
      const posts = await res.json();
      currentPage++;
      return posts;
    } catch (exception) {
      console.error(exception);
    }
  };

  const setPost = function (post) {
    // paginate
    const section = document.createElement("section");
    section.className = "article-container";
    section.innerHTML = `<div class="article-number"><span>${post.id}<span></div>
                        <div class="article-main">
                        <h2 class="article-title">${post.title}</h2>
                        <p class="article-body">${post.body}</p>
                        </div>`;
    main.appendChild(section);
  };

  const showPosts = async function () {
    const posts = await getPosts();

    posts.forEach((post) => {
      setPost(post);
    });
  };

  const filterPost = function (event) {
    const input = event.currentTarget.value.toLowerCase();
    if (input === null) return;

    const postElements = Array.from(main.children);
    postElements.forEach((postElement) => {
      const title = postElement.querySelector(".article-title");
      const body = postElement.querySelector(".article-body");

      if (
        title.textContent.toLowerCase().includes(input) ||
        body.textContent.toLowerCase().includes(input)
      ) {
        postElement.style.display = "block";
      } else {
        postElement.style.display = "none";
      }
    });
  };

  const scrollEventHandler = function (event) {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    if (Math.ceil(clientHeight + scrollTop) >= scrollHeight) {
      window.removeEventListener("scroll", scrollEventHandler);

      loaderContainer.classList.add("active");

      setTimeout(() => {
        loaderContainer.classList.remove("active");
      }, 700);

      setTimeout(async () => {
        await showPosts();
        window.addEventListener("scroll", scrollEventHandler);
      }, 1000);
    }
  };

  const init = async function () {
    await showPosts();
    filter.addEventListener("keyup", filterPost);
    window.addEventListener("scroll", scrollEventHandler);
  };

  init();
});
