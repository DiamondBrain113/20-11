// ===== ELEMENT SELECTORS =====
const textElement = document.querySelector('.loichuc');
const cardElement = document.querySelector('.thiep'); // Use the class selector
const cardElementById = document.getElementById('thiep-card'); // Use the ID for html2canvas

// Button Selectors
const newTextBtn = document.querySelector('.newtxt');
const newFontBtn = document.querySelector('.font');
const newBgBtn = document.querySelector('.bg');
const downloadBtn = document.querySelector('.dl');
const renewBtn = document.querySelector('.renew');
const sendBtn = document.querySelector('.send');


// ===== FUNCTIONS =====

/**
 * Grabs a random line from 'loichuc.txt' and displays it.
 */
async function randomtext(name) {
    try {
        const response = await fetch('resources/loichuc.txt');
        const data = await response.text();
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        textElement.innerHTML = randomLine.replace(/\n/g, '<br>');
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
 * Grabs a random image from Unsplash and sets it as the background.
 * Adjusts text color for readability based on background brightness.
 */
async function randombg() {
    try {
        const imageUrl = 'https://source.unsplash.com/random/500x600';
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Network response was not ok.');

        cardElement.style.backgroundImage = `url('${response.url}')`;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = response.url;
        
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
                totalBrightness += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
            }
            const avgBrightness = totalBrightness / (canvas.width * canvas.height);
            const textColor = avgBrightness > 125 ? 'black' : 'white';
            cardElement.style.color = textColor; // Set color on the parent for all text
        };
    } catch (error) {
        console.error('Error fetching background image:', error);
    }
}

/**
 * Prompts the user for a name and adds it to the card.
 */
function inputName() {
    // Remove any existing name before adding a new one
    const existingName1 = cardElement.querySelector('.sender-name');
    if (existingName1) {
        existingName1.remove();
    }
    const existingName2 = cardElement.querySelector('.recipient-name');
    if (existingName2) {
        existingName2.remove();
    }
  
    const name1 = prompt("Vui lòng nhập tên của bạn: (để trống để không chèn)");
    if (name1 && name1.trim() !== "") {
        const nameElement = document.createElement('p');
        nameElement.className = 'sender-name';
        nameElement.innerHTML = `Thân gửi,<br>${name1}`;
        cardElement.appendChild(nameElement);
    }
    const name2 = prompt("Vui lòng nhập tên giáo viên: (thầy/cô <tên>)(để trống để không chèn)");
    if (name2 && name2.trim() !== "") {
        
    }
}

/**
 * Captures the card element as an image and triggers a download.
 */
function downloadCard() {
    html2canvas(cardElementById, {
        useCORS: true, // Important for external images
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'thiep-tri-an-20-11.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
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