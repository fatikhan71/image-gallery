const filterButtons = document.querySelectorAll(".filter");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const imageTitle = document.getElementById("image-title");
const imageCount = document.getElementById("image-count");
const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let visibleItems = [...galleryItems];
let currentIndex = 0;
let lastFocusedElement = null;

function getVisibleItems() {
    return [...galleryItems].filter(item => !item.classList.contains("hidden"));
}

function filterGallery(category) {
    galleryItems.forEach(item => {
        const matches = category === "all" ||
            item.dataset.category === category;

        item.classList.toggle("hidden", !matches);
    });

    filterButtons.forEach(button => {
        const active = button.dataset.category === category;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    visibleItems = getVisibleItems();
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterGallery(button.dataset.category);
    });
});

function openLightbox(item) {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);

    if (currentIndex < 0) return;

    lastFocusedElement = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    showImage(currentIndex);
    closeBtn.focus();
}

function showImage(index) {
    if (!visibleItems.length) return;

    currentIndex = (index + visibleItems.length) % visibleItems.length;

    const item = visibleItems[currentIndex];
    const img = item.querySelector("img");
    const heading = item.querySelector(".overlay h3");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    imageTitle.textContent = heading.textContent;
    imageCount.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function showNext() {
    showImage(currentIndex + 1);
}

function showPrevious() {
    showImage(currentIndex - 1);
}

galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        openLightbox(item);
    });

    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open image in lightbox");

    item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(item);
        }
    });
});

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrevious);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNext();
    }

    if (event.key === "ArrowLeft") {
        showPrevious();
    }
});

let touchStartX = 0;

lightbox.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) < 50) return;

    if (difference < 0) {
        showNext();
    } else {
        showPrevious();
    }
}, { passive: true });

filterGallery("all");