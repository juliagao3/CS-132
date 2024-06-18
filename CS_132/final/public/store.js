/*
    Name: Julia Gao
    CS 132 Spring 2024
    Date: June 15, 2024
    This is store.js that implements all the different events that occur
    within the store such as switching between tabs, viewing single images, animations
    for promotions tab, shopping cart in which you can purchase items, and FAQs.
*/

(function() {
    "use strict";
    const IMAGES = ['imgs/bulk-image-crop/shop.png', 'imgs/bulk-image-crop/tea.png', 
                    'imgs/bulk-image-crop/farm.png', 'imgs/bulk-image-crop/types.png']
    const ERROR = "Something is wrong in Tea Leaves and Harmony. Please try again later."
    const NUM = 0;
    const NUM2 = 1;
    const INTERVAL = 3000;
    const TIME = 500;
    const TIMER = 1000;
    let count = 0;
    let totalPrice = 0;
    
    /**
     * Adds all of the event listeners necessary for the document
     */
    function init() {  
        const home = qs('#homeBtn');
        home.addEventListener("click", viewHome);

        const prom = qs('#promBtn');
        prom.addEventListener("click", viewProm);

        const order = qs('#prodBtn');
        order.addEventListener("click", viewProd);

        const faq = qs('#faqBtn');
        faq.addEventListener("click", viewFAQ);

        const contact = qs('#contactBtn');
        contact.addEventListener("click", viewCont);

        const cart = qs('#cartBtn');
        cart.addEventListener("click", viewCart);

        const shop = qs('#shopBtn');
        shop.addEventListener("click", viewProd); 

        document.addEventListener("DOMContentLoaded", () => {
            setInterval(changeImage, INTERVAL);
        });

        const checkboxes = qsa('.category-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked){
                    viewFilter(checkbox.value);
                } else {
                    viewProd();
                }
            });
        });

        qs('#contact-form').addEventListener("submit", (evt) => {
            evt.preventDefault();
            post();
        });
    }

    // View of the home page
    function viewHome() {
        qs('#home').classList.remove('hidden');
        qs('#product').classList.add('hidden');
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.add('hidden');
    }

    // Image carousel in which each img is changed after a specific interval
    function changeImage() {
        let div = qs('.container');
        let imagesrc = IMAGES[count];
        let image = div.querySelector('img');
        image.src = imagesrc;
        image.id = "home";
        count = (count + NUM2) % IMAGES.length;
    }

    // View of promotions page
    async function viewProm() {
        qs('#home').classList.add('hidden');
        qs('#product').classList.add('hidden');
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.remove('hidden');
        qs('#faq').classList.add('hidden');

        try {
            let resp = await fetch('/other-info');
            resp = await checkStatus(resp).json();


            const ul = qs('#list');
            ul.innerHTML = "";

            resp['promotions'].forEach((promotion, index) => {
                const li = gen('li');
                li.textContent = promotion;
                ul.appendChild(li);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        li.style.opacity = '1';
                        li.style.transform = 'translate(0)';
                    }, index * TIME);
                })
            });

        } catch (err) {
            handleError(ERROR);
        }
    }

    /**
    * 
    * Dynamically loads specific products that belong to the category
    * @param {string} type - the category of tea (e.g black, white, oolong, green)
    * 
    */
    async function viewFilter(type) {
        qs('#home').classList.add('hidden');
        qs('#product').classList.remove('hidden');
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.add('hidden');

        try {
            let response = await fetch(`/menu/${type}`);
            response = await checkStatus(response).json();

            const products = qs('#products');
            products.innerHTML = "";

            Object.entries(response).forEach(([_, tea]) => {
                generateProducts(products, tea, type);
            });
        } catch (error) {
            handleError(ERROR);
        }
    }

    // View all products in which is dynamically generated
    async function viewProd() {
        qs('#home').classList.add('hidden');
        qs('#product').classList.remove('hidden');
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.add('hidden');

        try {
            let response = await fetch('/menu');
            response = await checkStatus(response).json();

            const products = qs('#products');
            products.innerHTML = "";

            Object.entries(response['green']).forEach(([_, tea]) => {
                generateProducts(products, tea, 'green');
            });

            Object.entries(response['white']).forEach(([_, tea]) => {
                generateProducts(products, tea, 'white');
            });

            Object.entries(response['black']).forEach(([_, tea]) => {
                generateProducts(products, tea, 'black');
            });

            Object.entries(response['oolong']).forEach(([_, tea]) => {
                generateProducts(products, tea, 'oolong');
            });
        } catch (error) {
            handleError(ERROR);
        }
    }

    /**
     * Helper function in creating each product
     * @param {string} product - section the DOM elements are being appended to
     * @param {string} info - information about each specific product
     * @param {string} category - category of tea (e.g black, white, oolong, green)
     * 
     */
    function generateProducts(product, info, category) {
        const fig = gen('figure');
        fig.classList.add(category);

        const img = gen('img');
        img.src = info['img'];
        img.alt = info['name'];

        img.addEventListener("click", () => {
            generateSingle(info['name'], category);
        });

        const figcap = gen('figcaption');
        figcap.textContent = info['name'];

        fig.appendChild(img);
        fig.appendChild(figcap);
        product.append(fig);
    }

     /**
     * 
     * Dynamically loads single product view page of the item
     * @param {string} name - name of product
     * @param {string} category - category of tea (e.g black, white, oolong, green)
     * 
     */
    async function generateSingle(name, category) {
        qs('#product').classList.add('hidden');
        qs('#single').classList.remove('hidden');

        try {
            let info = await fetch(`/menu/${category}/${name}`);
            info = await checkStatus(info).json();

            const singleView = qs('#single');
            singleView.innerHTML = "";

            const figure = gen('figure');
            figure.classList.add('item');

            const image = gen('img');
            image.src = info['img'];
            image.alt = name;

            const div = gen('div');

            const header = gen('h2');
            header.textContent = name;
            const p = gen('pre');
            p.textContent = `Origin: ${info['origin']}

    Nutrional Values:
    - Calories: ${info['nutritional_values']['calories']}
    - Caffeine: ${info['nutritional_values']['caffeine_mg']}
    - Antioxidants: ${info['nutritional_values']['antioxidants_mg']}

    Price per ounce: $${info['price_per_ounce_usd']}`;

            const button = gen('button');
            button.textContent = 'Back';
            button.id = 'back';
            button.addEventListener("click", () => {
                qs('#product').classList.remove('hidden');
                qs('#single').classList.add('hidden');
            });

            const title = gen('h3');
            title.textContent = "Quantity";
            const title2 = gen('h3');
            title2.textContent = "Items";
            const filter = gen('select');
            const filter2 = gen('select');

            div.appendChild(header);
            div.appendChild(p);

            generateQuantity(filter, div, title);

            generateItems(filter2, div, title2);

            const button2 = gen('button');
            button2.textContent = 'Add to Cart';
            button2.id = 'front';
            button2.addEventListener("click", () => {
                const cart =  qs('#cart');

                const aside = qs('#info');
                const section = qs('#price');

                const fig = gen('figure');
                fig.classList.add('item');
                
                const img = gen('img');
                img.src = info['img'];
                img.alt = info['name'];

                const div2 = gen('div');
                const head = gen('h2');
                head.textContent = info['name'];
                const p = gen('pre');
                const quantity = filter.value;
                const item = filter2.value;
                p.textContent = `Quantity: ${quantity}
    Items: ${item}`;

                const price = gen('p');
                let total = parseFloat(quantity.match(/\d+/)[NUM]) * parseFloat(item) * parseFloat(info['price_per_ounce_usd']);
                price.textContent = `${info['name']}: $${total}`;
                price.classList.add('total');
                price.value = total;

                div2.appendChild(head);
                div2.appendChild(p);

                fig.appendChild(img);
                fig.appendChild(div2);
                section.insertBefore(price, qs('#totalPrice'));
                aside.appendChild(fig);
                cart.appendChild(aside);
                cart.appendChild(section);

                const del = gen('button');
                del.innerHTML = '&#x1F5D1;';

                fig.appendChild(del);

                del.addEventListener("click", () => {
                    aside.removeChild(fig);
                    section.removeChild(price);
                    const p = qs('#totalPrice');
                    if (aside.childNodes.length == NUM) {
                        p.textContent = 'Total: $0';
                        totalPrice = 0;
                    } else {
                        p.textContent = `Total: $${totalPrice - total}`;
                    }
                });

                const add = gen('p');
                add.textContent = "Item has been successfully added to cart!";
                div.appendChild(add);

                setTimeout(() => {
                    div.removeChild(add);
                }, TIMER);

                totalPrice = totalPrice + total;
            });

            figure.appendChild(image);
            figure.appendChild(div);
            singleView.appendChild(button);
            singleView.appendChild(button2);
            singleView.appendChild(figure);
        } catch {
            handleError(ERROR);
        }
    }

    /**
     * 
     * @param {string} filter - 'select' to add to
     * @param {string} div - 'div' to add to
     * @param {string} title - title of dropdown
     */
    async function generateQuantity(filter, div, title) {
        try {
            let response = await fetch("/other-info");
            response = await checkStatus(response).json();
    
            response['ounces'].forEach(value => {
                const option = gen('option');
                option.textContent = value;
                filter.appendChild(option);
            });

            div.appendChild(title);
            div.appendChild(filter);
        } catch (err) {
            handleError(ERROR);
        }
    }

    /**
     * 
     * @param {string} filter - 'select' to add to
     * @param {string} div - 'div' to add to
     * @param {string} title - title of dropdown
     */
    async function generateItems(filter, div, title) {
        try {
            let response = await fetch("/other-info");
            response = await checkStatus(response).json();
            
            response['items'].forEach(value => {
                const option = gen('option');
                option.textContent = value;
                filter.appendChild(option);
            });

            div.appendChild(title);
            div.appendChild(filter);
        } catch (err) {
            handleError(ERROR);
        }
    }

    // View of the FAQ page
    async function viewFAQ() {
        qs('#home').classList.add('hidden');
        qs('#product').classList.add('hidden')
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.remove('hidden');

        try {
            let response = await fetch("/other-info");
            response = await checkStatus(response).json();

            const section = qs('#faq');
            section.innerHTML = "";

            response['faq'].forEach((element, index) => {
                const article = gen('article');
                const h4 = gen('h4');
                h4.textContent = element['question'];
                article.appendChild(h4);

                let isVisible = false;

                h4.addEventListener("click", () => {
                    const existingP = article.querySelector('p');

                    if (!isVisible && !existingP) {
                    const p = gen('p');
                    p.textContent = element['answer'];
                    article.appendChild(p);
                    isVisible = true;
                    } else if (isVisible && existingP) {
                    existingP.remove();
                    isVisible = false;
                    }
                });

                section.appendChild(article);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        article.style.opacity = '1';
                        article.style.transform = 'translate(0)';
                    }, index * TIME);
                })
            });

        } catch (err) {
            handleError(ERROR);
        }

    }

    // View of the contact page with form
    function viewCont() {
        qs('#home').classList.add('hidden');
        qs('#product').classList.add('hidden')
        qs('#contact').classList.remove('hidden');
        qs('#cart').classList.add('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.add('hidden');
    }

    // Retrieves response after submitting form
    async function post() {
        let form = new FormData(id("contact-form"));

        try {
            let response = await fetch("/contacts", {method: "POST", body: form});
            response = await checkStatus(response).text();
            showRecieved(response);
        } catch (err) {
            handleError(ERROR);
        }
    }

    /**
     * Displays response
     * @param {String} responseText - response
     */
    function showRecieved(responseText) {
        id("results").textContent = responseText;
        setTimeout(() => {
            id("results").textContent = '';
            qs('#first').value = '';
            qs('#last').value = '';
            qs('#message').value = '';
            qs('#email').value = '';
        }, TIMER);
    }

    // View of the cart page
    async function viewCart() {
        qs('#home').classList.add('hidden');
        qs('#product').classList.add('hidden')
        qs('#contact').classList.add('hidden');
        qs('#cart').classList.remove('hidden');
        qs('#single').classList.add('hidden');
        qs('#promotion').classList.add('hidden');
        qs('#faq').classList.add('hidden');
        qs('#price').classList.remove('hidden');
        qs('#info').classList.remove('hidden');

        const p = qs('#totalPrice');
        p.textContent = `Total: $${totalPrice}`;

        const button = qs('#checkout');
        button.addEventListener("click", getCartInfo);
    }

    // Display the cart info and submits purchase and retrieves response
    async function getCartInfo() {
        try {
            const items = qsa('#info .item');
            const cartItems = [];
            items.forEach(i => {
                const img = i.querySelector('img');
                const div = i.querySelector('div');
                const name = div.querySelector('h2');
                const description = div.querySelector('pre');

                const data = {
                    "img": img.src,
                    "name": name.textContent,
                    "quantity/item": description.textContent,
                    "timestamp" : new Date().toUTCString()
                };

                cartItems.push(data);
            });

            let response = await fetch("/cart", {method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(cartItems)});
            response = await checkStatus(response).text();
            showConfirmation(response);
        } catch (err) {
            handleError(ERROR);
        }
    }

    /**
     * Displays the confirmation reponse
     * @param {string} response - response text 
     * 
     */
    function showConfirmation(response) {
        qs('#price').classList.add('hidden');
        qs('#info').classList.add('hidden');
        qs('#confirmation').classList.remove('hidden');

        const checkout = qs('#confirmation p')
        checkout.textContent = response;

        const button = qs('#shop');
        button.addEventListener("click", () => {
            qs('#confirmation').classList.add('hidden');
            qs('#product').classList.remove('hidden');

            qs('#info').innerHTML = "";

            const section = qs('#price');
            section.innerHTML = "";
            totalPrice = NUM;

            const p = gen('p');
            p.id = "totalPrice";
            p.textContent = `Total Price: ${totalPrice}`;

            const button2 = gen('button');
            button2.id = "checkout";
            button2.textContent = "Checkout";
            
            section.appendChild(p);
            section.appendChild(button2);
        });
    }   

    /**
     * Handles the errors that occur
     * @param {string} errMsg - specific error message
     * 
     */
    function handleError(errMsg) {
        qs("#message-area").textContent = errMsg;
        qs("#message-area").classList.remove("hidden");
    }

    init(); 
})();