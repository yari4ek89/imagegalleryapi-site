const contentContainer = document.querySelector('.content');
const lightboxContainer = document.querySelector('.lightbox');
const lightboxContentContainer = document.querySelector('.lightbox-content');
const closeLightbox = document.querySelector('#close');
const prevLightbox = document.querySelector('#prev');
const nextLightbox = document.querySelector('#next');
const queryInput = document.querySelector('#query-input');

const PEXELS_API = '9GHTolHvjClxWtSt5bxqwGPVKC01qZugVS5Nep8w9dlpxxBWiA7kjxfq';

async function generateContent(api, link = 0) {
    let response;
    contentContainer.innerHTML = '';

    if (link !== 0) {
        response = await fetch(`https://api.pexels.com/v1/search?query=${link}&page=1&per_page=12`, {
            headers: {
                Authorization: api,
            },
        });
    } else {
        response = await fetch(`https://api.pexels.com/v1/curated?page=1&per_page=12`, {
            headers: {
                Authorization: api,
            },
        });
    }
    const result = await response.json();

    for (let i = 0; i < result.photos.length; i++) {
        const imageEl = document.createElement('img');
        imageEl.src = result.photos[i].src.medium;
        imageEl.addEventListener('click', () => showLightBox(imageEl.src));
        contentContainer.appendChild(imageEl);
    }
}

function showLightBox(src, action = 0) {
    const imgEl = document.createElement('img');

    if (action === 0) {
        imgEl.src = src;
        imgEl.addEventListener('click', () => showLightBox(1, 1));
        imgEl.classList.add('removable');
        lightboxContentContainer.appendChild(imgEl);
        lightboxContainer.style.display = 'block';
    } else if (action === 1) {
        lightboxContentContainer.childNodes.forEach(el => {
            if (el.className === 'removable') lightboxContentContainer.removeChild(el);
        });
        lightboxContainer.style.display = 'none';
    }
}

function nextImage(action = 0) {
    let currentImage;
    lightboxContentContainer.childNodes.forEach(el => {
        if (el.className === 'removable') return currentImage = el;
    });

    for (let i = 0; i < contentContainer.childNodes.length; i++) {
        if (contentContainer.childNodes[i].src === currentImage.src) {
            currentImage.classList.remove('removable');
            if (action === 0) currentImage.classList.add('animimg-left');
            else currentImage.classList.add('animimg-right');
            setTimeout(() => {
                if (action === 0) currentImage.classList.remove('animimg-left');
                else currentImage.classList.remove('animimg-right');
                lightboxContentContainer.removeChild(currentImage);
                const imgEl = document.createElement('img');
                try {
                    if (action === 0) imgEl.src = contentContainer.childNodes[i + 1].src;
                    else imgEl.src = contentContainer.childNodes[i - 1].src;
                    imgEl.addEventListener('click', () => showLightBox(1, 1));
                    imgEl.classList.add('removable');
                } catch {
                    if (action === 0) imgEl.src = contentContainer.childNodes[0].src;
                    else imgEl.src = contentContainer.childNodes[contentContainer.childNodes.length - 1].src;
                    imgEl.addEventListener('click', () => showLightBox(1, 1));
                    imgEl.classList.add('removable');
                }
                lightboxContentContainer.appendChild(imgEl);
            }, 2000);
        }
    }
}

closeLightbox.addEventListener('click', () => showLightBox(1, 1));
nextLightbox.addEventListener('click', () => nextImage());
prevLightbox.addEventListener('click', () => nextImage(1));
queryInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') return generateContent(PEXELS_API, queryInput.value.trim());
})

generateContent(PEXELS_API);