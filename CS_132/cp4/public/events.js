/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: June 13, 2024
    This is events.js that implements fetch calls and carousels for my personal
    webpage. It has all the events that occur on my website.
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
    const NUM2 = 2;
    let count = 0;
  
    // Initializes all of the different event handlers
    async function init() {
        const containers = qsa('.images');
        containers.forEach(container => {
            const leftButton = container.querySelector(".left-button");
            const rightButton = container.querySelector(".right-button");
            const city = container.id;
            leftButton.addEventListener("click", () => changeImage(city, "backward"));
            rightButton.addEventListener("click", () => changeImage(city, "forward"));
        });    

        const home = qs('#home');
        home.addEventListener("click", viewHome);

        const resume = qs('#resumeLink');
        resume.addEventListener("click", viewResume);

        const hobbies = qs('#hobbyLink');
        hobbies.addEventListener("click", viewHobbies);

        const courses = qs('#courseLink');
        courses.addEventListener("click", viewCourses);

        const all = qs('#cs');
        all.addEventListener("click", viewAll);

        const favorite = qs('#fav');
        favorite.addEventListener("click", viewSpecific);

        const london = qs('#country-united-kingdom');
        london.addEventListener("click", () => viewCountry(london.id))

        const france = qs('#country-france');
        france.addEventListener("click", () => viewCountry(france.id))

        const czech = qs('#country-czechia');
        czech.addEventListener("click", () => viewCountry(czech.id))
    }

    /**
     * Calculates the index for which image is next
     * @param {string} city - specific city
     * @param {string} direction - either forward or backward
     */
    function changeImage(city, direction) {
        const numIMAGES = PATHS[city].length;
        if (direction === "forward") {
            updateImage(city, count);
            count = (count + NUM) % numIMAGES;
        } else {
            count = (count - NUM + numIMAGES) % numIMAGES;
            updateImage(city, count);
        }
    }

    /**
     * Changes the image on the page
     * @param {string} city - specific city
     * @param {integer} count - the index of next image
     */
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

    // View resume tab
    function viewResume() {
        qs('#personal').classList.add('hidden');
        qs('#resume').classList.remove('hidden');
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.add('hidden');
        qs('#courses').classList.add('hidden');

        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');
    }

    function viewHome() {
        qs('#personal').classList.remove('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.add('hidden');
        qs('#courses').classList.add('hidden');

        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');
    }

    // View hobbies tab
    function viewHobbies() {
        qs('#personal').classList.add('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.remove('hidden');
        qs('#countries').classList.add('hidden');
        qs('#courses').classList.add('hidden');

        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');
    }

    /**
     * View the country information for specific country
     * @param {string} country_name - specific country name
     * 
     */
    async function viewCountry(country_name) {
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.remove('hidden');

        // inspiration: https://en.wikipedia.org/wiki/France
        const name = country_name.split('-');
        let url = '';
        if (name.length == NUM2){
            url = `https://restcountries.com/v3.1/name/${name[NUM]}`;
        }
        else {
            url = `https://restcountries.com/v3.1/name/${name[NUM]+' '+name[NUM2]}`;
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

    // View courses tab
    function viewCourses() {
        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');

        qs('#personal').classList.add('hidden');
        qs('#resume').classList.add('hidden');
        qs('#hobbies').classList.add('hidden');
        qs('#countries').classList.add('hidden');
        qs('#courses').classList.remove('hidden');
    }

    // View all courses I have taken
    async function viewAll() {
        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');
        
        qs('#courses').classList.add('hidden');
        qs('#all').classList.remove('hidden');

        try {
            let response = await fetch('/all-courses');
            response = await checkStatus(response).json();

            const section = qs('#all');
            section.innerHTML = '';

            const button = gen('button');
            button.textContent = 'Back';
            button.addEventListener('click', () => { 
                section.classList.add('hidden');
                qs('#courses').classList.remove('hidden');
            });

            section.appendChild(button);

            Object.entries(response['courses']).forEach(([courseCode, course]) => {
                displayCourse(section, course['number'], course['course name'], course['professor'], course['description']);
            });

        } catch (error) {
            handleError("Failed to fetch courses");
        }
    }

    // View courses that I liked
    async function viewSpecific() {
        const errorMessage = qs('#message-area');
        errorMessage.classList.add('hidden');

        qs('#courses').classList.add('hidden');
        qs('#favorite').classList.remove('hidden');

        try {
            let response = await fetch('/all-courses/CS 4');
            response = await checkStatus(response).json();

            const section = qs('#favorite');
            section.innerHTML = "";

            const button = gen('button');
            button.textContent = 'Back';
            button.addEventListener('click', () => {
                qs('#favorite').classList.add('hidden');
                qs('#courses').classList.remove('hidden');
            });

            section.appendChild(button);
            
            displayCourse(section, response['number'], 
                          response['course name'],
                          response['professor'], 
                          response['description']);

            let response2 = await fetch('/all-courses/CS 130');
            response2 = await checkStatus(response2).json();
            
            displayCourse(section, response2['number'], 
                          response2['course name'],
                          response2['professor'], 
                          response2['description']);

            let response3 = await fetch('/all-courses/EE 148');
            response3 = await checkStatus(response3).json();
            
            displayCourse(section, response3['number'], 
                         response3['course name'], 
                         response3['professor'], 
                         response3['description']);

            let response4 = await fetch('/all-courses/CMS 155');
            response4 = await checkStatus(response4).json();
            
            displayCourse(section, response4['number'], 
                          response4['course name'],
                          response4['professor'], 
                          response4['description']);

        } catch (error) {
            handleError("Failed to fetch courses");
        }
    }

    /**
     * Displays each course with the section and name, description, and professor
     * @param {string} section - the html section
     * @param {string} courseNum - course number
     * @param {string} courseName - course name
     * @param {string} professor - professor
     * @param {string} description - description of the course
     */
    function displayCourse(section, courseNum, courseName, professor, description) {
        const courseDiv = gen('div');
        courseDiv.classList.add('course');
    
        const courseTitle = gen('h3');
        courseTitle.textContent = courseNum + ": " + courseName;
    
        const courseProfessor = gen('p');
        courseProfessor.textContent = `Professor: ${professor}`;
    
        const courseDescription = gen('p');
        courseDescription.textContent = description;
    
        courseDiv.appendChild(courseTitle);
        courseDiv.appendChild(courseDescription);
        courseDiv.appendChild(courseProfessor);
    
        section.appendChild(courseDiv);
    }

    /**
     * Hangles all the errors that occur
     * @param {string} errMsg - specific error message
     * 
     */
    function handleError(errMsg) {
        if (typeof errMsg === "string") {
            qs("#message-area").textContent = errMsg;
        } else {
            qs("#message-area").textContent =
                "An error ocurred fetching the country data. Please try again later.";
        }
        qs("#message-area").classList.remove("hidden");
    }

    init(); 
})();