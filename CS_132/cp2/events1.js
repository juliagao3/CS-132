(function() {
    "use strict";
    const paths = {'london': ['imgs/london_1.jpg', 'imgs/london3.jpg', 'imgs/london4.jpg', 'imgs/london.png'],
        'france': ['imgs/france2.JPG', 'imgs/france.png', 'imgs/france1.jpg'],
        'prague': ['imgs/prague2.JPG', 'imgs/prague3.png', 'imgs/prague.png'],
        'julia': ['imgs/julia2.JPG', 'imgs/julia3.jpg', 'imgs/julia1.png']};
    let count = 0;
  
    function init() {
        const CONTAINERS = qsa('.images');
        CONTAINERS.forEach(container => {
            const leftButton = container.querySelector(".left-button");
            const rightButton = container.querySelector(".right-button");
            const city = container.id;
            leftButton.addEventListener("click", () => changeImage(city, "backward"));
            rightButton.addEventListener("click", () => changeImage(city, "forward"));
        });    

        const HOME = qs('#home');
        HOME.addEventListener("click", viewHome);

        const RESUME = qs('#resumeLink');
        RESUME.addEventListener("click", viewResume);
    }

    function changeImage(city, direction) {
        const NUMIMAGES = paths[city].length;
        const NUM = 1;
        if (direction === "forward") {
            updateImage(city, count);
            count = (count + NUM) % NUMIMAGES;
        } else {
            count = (count - NUM + NUMIMAGES) % NUMIMAGES;
            updateImage(city, count);
        }
    }

    function updateImage(city, count) {
        let cont = qs('#' + city);
        let imagesrc = paths[city][count];
        let image = cont.querySelector("img");
        if (image) {
            cont.removeChild(image);
        }
        image.src = imagesrc;
        cont.appendChild(image);
    }

    function viewResume() {
        qs('#personal').classList.add('hidden');
        qs('#resume').classList.remove('hidden');
    }

    function viewHome() {
        qs('#personal').classList.remove('hidden');
        qs('#resume').classList.add('hidden');
    }

    init(); 
})();