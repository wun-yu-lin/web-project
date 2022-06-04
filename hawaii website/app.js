let header = document.querySelector("header");
let headerAchor = document.querySelectorAll("header nav ul li a");

window.addEventListener("scroll", () => {
  if (window.pageYOffset != 0) {
    header.style.backgroundColor = "black";
    header.style.color = "white";
    headerAchor.forEach((n) => {
      n.style.color = "white";
    });
  } else {
    header.style.backgroundColor = "";
    headerAchor.forEach((n) => {
      n.style.color = "";
    });
  }
});
