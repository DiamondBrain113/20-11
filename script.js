const texts = ["Hello bro", "Skill issue 💀", "Minecraft?", "Portal gun?", "Sigma alert"];
const googleFonts = [
    "Roboto",
    "Poppins",
    "Anton",
    "Lobster",
    "Bebas Neue",
    "Playfair Display",
    "Fira Code",
    "Pacifico",
    "Oswald",
    "Raleway"
];

const bgs = ["#ffd6a5", "#caffbf", "#9bf6ff", "#bdb2ff", "#ffadad", "#fdffb6"];

const box = document.getElementById("box");

function loadGoogleFont(font) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
    document.head.appendChild(link);
}

box.addEventListener("click", () => {
    // Random text
    box.innerText = texts[Math.floor(Math.random() * texts.length)];

    // Random font
    const font = googleFonts[Math.floor(Math.random() * googleFonts.length)];
    loadGoogleFont(font);
    box.style.fontFamily = `'${font}', sans-serif`;

    // Random background
    box.style.background = bgs[Math.floor(Math.random() * bgs.length)];
});
