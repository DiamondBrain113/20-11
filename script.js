// ===== GLOBAL VARIABLES =====
let teacherName = ""; // make name2 global

// ===== ELEMENT SELECTORS =====
const textElement = document.querySelector('.loichuc');
const cardElement = document.querySelector('.thiep');
const cardElementById = document.getElementById('thiep-card');

// Button Selectors
const newTextBtn = document.querySelector('.newtxt');
const newFontBtn = document.querySelector('.font');
const newBgBtn = document.querySelector('.bg');
const downloadBtn = document.querySelector('.dl');
const renewBtn = document.querySelector('.renew');
const sendBtn = document.querySelector('.send');


// ===== FUNCTIONS =====

/**
 * Grabs a random line from 'loichuc.txt' or 'loichuc+name.txt' if teacherName is set.
 * Replaces {name} placeholder with teacherName.
 */
async function randomtext() {
    try {
        // choose file depending on teacherName
        const file = teacherName ? 'resources/loichuc+name.txt' : 'resources/loichuc.txt';
        const response = await fetch(file);
        const data = await response.text();
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const randomLine = lines[Math.floor(Math.random() * lines.length)];

        // replace placeholder if teacherName exists
        const finalLine = teacherName 
            ? randomLine.replace(/\{name\}/g, teacherName) 
            : randomLine;

        textElement.innerHTML = finalLine.replace(/\n/g, '<br>');
    } catch (error) {
        console.error('Error fetching text:', error);
        textElement.innerText = 'Could not load a new message.';
    }
}

/**
 * Grabs a random font from 'fonts.txt' and applies it via Google Fonts.
 */
async function randomfont() {
    try {
        const response = await fetch('resources/fonts.txt');
        const data = await response.text();
        const fonts = data.split('\n').filter(font => font.trim() !== '');
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

        WebFont.load({
            google: {
                families: [randomFont]
            },
            active: function() {
                textElement.style.fontFamily = randomFont;
            }
        });
    } catch (error) {
        console.error('Error fetching fonts:', error);
    }
}

/**
 * Picks a random background image from /resources/background using a manifest file.
 */
async function randombg() {
    try {
        // Fetch the manifest file (list of background filenames)
        const response = await fetch('resources/background/backgrounds.txt');
        const data = await response.text();
        const backgrounds = data.split('\n').filter(line => line.trim() !== '');

        // Pick one at random
        const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        const imagePath = `resources/background/${randomBg}`;

        // Apply as background
        cardElement.style.backgroundImage = `url('${imagePath}')`;

        // Load image for brightness detection
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imagePath;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let totalBrightness = 0;

            for (let i = 0; i < data.length; i += 4) {
                // Weighted brightness formula
                totalBrightness += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
            }

            const avgBrightness = totalBrightness / (canvas.width * canvas.height);

            // Decide text color
            const textColor = avgBrightness > 125 ? 'black' : 'white';
            cardElement.style.color = textColor;
        };
    } catch (error) {
        console.error('Error setting background image:', error);
    }
}
/**
 * Prompts the user for names and stores teacherName globally.
 */
function inputName() {
    // Remove any existing names
    const existingName1 = cardElement.querySelector('.sender-name');
    if (existingName1) existingName1.remove();
    const existingName2 = cardElement.querySelector('.recipient-name');
    if (existingName2) existingName2.remove();
  
    const name1 = prompt("Vui lòng nhập tên của bạn: (để trống để không chèn)");
    if (name1 && name1.trim() !== "") {
        const nameElement = document.createElement('p');
        nameElement.className = 'sender-name';
        nameElement.innerHTML = `Thân gửi,<br>${name1}`;
        cardElement.appendChild(nameElement);
    }
    const name2 = prompt("Vui lòng nhập tên giáo viên: (thầy/cô <tên>)(để trống để không chèn)");
    if (name2 && name2.trim() !== "") {
        teacherName = name2; // store globally
        const recipientElement = document.createElement('p');
        recipientElement.className = 'recipient-name';
        recipientElement.innerHTML = `Kính gửi ${teacherName}`;
        cardElement.appendChild(recipientElement);
        randomtext();
    }
}

/**
 * Captures the card element as an image and triggers a download.
 */
function downloadCard() {
    // Use dom-to-image to convert the card element into a PNG
    domtoimage.toPng(cardElementById)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'thiep-tri-an-20-11.png';
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            console.error('Oops, something went wrong with the download!', error);
            alert('Could not download the card. Please try again.');
        });
}


/**
 * Runs all the randomizing functions at once.
 */
function randomall() {
    randomtext();
    randomfont();
    randombg();
}

// ===== EVENT LISTENERS =====
newTextBtn.addEventListener('click', randomtext);
newFontBtn.addEventListener('click', randomfont);
newBgBtn.addEventListener('click', randombg);
renewBtn.addEventListener('click', randomall);
downloadBtn.addEventListener('click', downloadCard);
sendBtn.addEventListener('click', inputName);

// ===== INITIAL LOAD =====
document.addEventListener('DOMContentLoaded', randomall);
