/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: April 26, 2024
    This is events.js that implements fetch calls and carousels for my personal
    webpage.
*/

(function() {
    "use strict";
    const PATHS = {'london': ['imgs/london_1.jpg', 'imgs/london3.jpg', 'imgs/london4.jpg', 'imgs/london.png'],
        'france': ['imgs/france2.jpg', 'imgs/france.png', 'imgs/france1.jpg'],
        'prague': ['imgs/prague2.jpg', 'imgs/prague3.png', 'imgs/prague.png'],
        'julia': ['imgs/julia2.jpg', 'imgs/julia3.jpg', 'imgs/julia1.png']};
    const MAPS = {'france': 'imgs/country-france.png', 'united kingdom': 'imgs/country-uk.png',
        'czechia': 'imgs/country-czechia.png'};
    const NUMBER = 0;
    const NUM = 1;
    let count = 0;
  
    async function init() {
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

        const HOBBIES = qs('#hobbyLink');
        HOBBIES.addEventListener("click", viewHobbies);

        const LONDON = qs('#country-united-kingdom');
        LONDON.addEventListener("click", () => viewCountry(LONDON.id))

        const FRANCE = qs('#country-france');
        FRANCE.addEventListener("click", () => viewCountry(FRANCE.id))

        const CZECH = qs('#country-czechia');
        CZECH.addEventListener("click", () => viewCountry(CZECH.id))
    }

    function changeImage(city, direction) {
        const NUMIMAGES = PATHS[city].length;
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
        let imagesrc = PATHS[city][count];
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
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.add('hidden');
    }

    function viewHome() {
        qs('#personal').classList.remove('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.add('hidden');
    }

    function viewHobbies() {
        qs('#personal').classList.add('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.remove('hidden');
        qs('#countries').classList.add('hidden');
    }

    async function viewCountry(country_name) {
        qs('#personal').classList.add('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.remove('hidden');

        // inspiration: https://en.wikipedia.org/wiki/France
        const name = country_name.split('-');
        let url = '';
        if (name.length == 2){
            url = `https://restcountries.com/v3.1/name/${name[1]}`;
        }
        else {
            url = `https://restcountries.com/v3.1/name/${name[1]+' '+name[2]}`;
        }

        try {
            let response = await fetch(url);

            response = await checkStatus(response).json();
            response = response[NUMBER];
            
            const errorMessage = qs('#message-area');
            errorMessage.classList.add('hidden');

            const country = qs('#countries');
            country.innerHTML = '';

            const button = gen('button');
            button.textContent = 'Back';
            button.addEventListener('click', () => {
                country.classList.add('hidden');
                qs('#hobbies').classList.remove('hidden');
            });

            const header = gen('header');
            const h1 = gen('h3');
            h1.textContent = response['name']['common'];

            const h2 = gen('h4');
            h2.textContent = `Official: ${response['name']['official']}`;

            header.appendChild(h1);
            header.appendChild(h2);

            const details = gen('div');
            details.classList.add('info');

            const img = gen('img');
            img.src = MAPS[response['name']['common'].toLowerCase()];
            img.alt = response['name']['common'];

            const ul = gen('ul');

            const li5 = gen('li');
            li5.textContent = `Region: ${response['region']}`;

            const li6 = gen('li');
            li6.textContent = `Subregion: ${response['subregion']}`;

            const li7 = gen('li');
            li7.textContent = `Landlocked: ${response['landlocked']}`;

            const li = gen('li');
            li.textContent = `Capital: ${response['capital']}`;

            const li2 = gen('li');
            li2.textContent = `Official Language: ${response['languages']['fra']}`;

            const li3 = gen('li');
            li3.textContent = `Demonyms: ${response['demonyms']['eng']['f']}`;

            const li4 = gen('li');
            li4.textContent = `Flag: ${response['flag']}`;

            const li8 = gen('li');
            li8.textContent = `Population: ${response['population']} `;

            const li9 = gen('li');
            if (country_name == 'country-united-kingdom') {
                li9.textContent = `Currency: ${response['currencies']['GBP']['name']}`;
            }
            else if (country_name == 'country-france') {
                li9.textContent = `Currency: ${response['currencies']['EUR']['name']}`;
            }
            else if (country_name == 'country-czechia') {
                li9.textContent = `Currency: ${response['currencies']['CZK']['name']}`;
            }

            ul.appendChild(li5);
            ul.appendChild(li6);
            ul.appendChild(li7);
            ul.appendChild(li);
            ul.appendChild(li2);
            ul.appendChild(li3);
            ul.appendChild(li4);
            ul.appendChild(li8);
            ul.appendChild(li9);
            
            details.appendChild(img);
            details.appendChild(ul);

            country.appendChild(button);
            country.appendChild(header);
            country.appendChild(details);

        } catch (error) {
            handleError(error);
        }
    }

    function handleError(errMsg) {
        if (typeof errMsg === "string") {
            qs("#message-area").textContent = errMsg;
        } else {
            // the err object was passed, don't want to show it on the page;
            // instead use generic error message.
            qs("#message-area").textContent =
                "An error ocurred fetching the country data. Please try again later.";
        }
        qs("#message-area").classList.remove("hidden");
    }

    init(); 
})();