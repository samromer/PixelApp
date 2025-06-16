//variables
const MDCBanner = mdc.banner.MDCBanner; const MDCCheckbox = mdc.checkbox.MDCCheckbox; const MDCChip = mdc.chips.MDCChip; const MDCChipSet = mdc.chips.MDCChipSet; const MDCCircularProgress = mdc.circularProgress.MDCCircularProgress; const MDCDataTable = mdc.dataTable.MDCDataTable; const MDCDialog = mdc.dialog.MDCDialog; const MDCDrawer = mdc.drawer.MDCDrawer; const MDCFloatingLabel = mdc.floatingLabel.MDCFloatingLabel; const MDCFormField = mdc.formField.MDCFormField; const MDCIconButtonToggle = mdc.iconButton.MDCIconButtonToggle; const MDCLineRipple = mdc.lineRipple.MDCLineRipple; const MDCLinearProgress = mdc.linearProgress.MDCLinearProgress; const MDCList = mdc.list.MDCList; const MDCMenu = mdc.menu.MDCMenu; const MDCMenuSurface = mdc.menuSurface.MDCMenuSurface; const MDCNotchedOutline = mdc.notchedOutline.MDCNotchedOutline; const MDCRadio = mdc.radio.MDCRadio; const MDCRipple = mdc.ripple.MDCRipple; const MDCSegmentedButton = mdc.segmentedButton.MDCSegmentedButton; const MDCSelect = mdc.select.MDCSelect; const MDCSlider = mdc.slider.MDCSlider; const MDCSnackbar = mdc.snackbar.MDCSnackbar; const MDCSwitch = mdc.switchControl.MDCSwitch; const MDCTabBar = mdc.tabBar.MDCTabBar; const MDCTextField = mdc.textField.MDCTextField; const MDCTooltip = mdc.tooltip.MDCTooltip; const MDCTopAppBar = mdc.topAppBar.MDCTopAppBar;

let drawer;
let topAppBarElement;
let topAppBar;

let menuButton;
let listEl;

let art;
let blog;
let trick;

let liked;
let likedPosts;

let searchText;

let posts;

// all on clicks or entes etc. have to be set in the onload
window.onload = () => {

    //variables again so that they don't break lol
    drawer = new MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    topAppBarElement = document.querySelector('.mdc-top-app-bar');
    topAppBar = new MDCTopAppBar(topAppBarElement)

    menuButton = document.querySelector('#drawerOpen');
    listEl = document.querySelector('#drawerClose');

    likedPosts = [''];


    // startup;
    getData();

    // click events 
    menuButton.addEventListener('click', () => {
        openDrawer();
    });

    listEl.addEventListener('click', () => {
        closeDrawer();
    });

    document.querySelector("#sheetClose").addEventListener('click', () => {
        closeSheet();
    });

    document.querySelector("#homeButton").addEventListener('click', () => {

        document.querySelector(`#search`).parentElement.classList.add("hidden");
        document.querySelector(`#pageTitle`).classList.remove("hidden");
        document.querySelector(`#likedPage`).classList.remove("hidden");

        resetTabs();
        showAll();
    });

    document.querySelector("#pageTitle").addEventListener('click', () => {
        resetTabs();
        showAll();
    });

    document.querySelector("#likedPage").addEventListener('click', () => {
        resetTabs();

        hideAll();
        liked = document.querySelectorAll(".liked");
        hideNshow(liked, 1);

        if (likedPosts.length > 1) {
            document.querySelector("#pageTitle").innerHTML = "Liked posts";
        } else {
            document.querySelector("#pageTitle").innerHTML = "No liked posts";
        }
    });

    document.querySelector("#artTab").addEventListener('click', () => {
        resetTabs();

        hideAll();
        hideNshow(art, 1);
        addActive("art");
    });

    document.querySelector("#trickTab").addEventListener('click', () => {
        resetTabs();

        hideAll();
        hideNshow(trick, 1);
        addActive("trick");
    });
    document.querySelector("#blogTab").addEventListener('click', () => {
        resetTabs();

        hideAll();
        hideNshow(blog, 1);
        addActive("blog");
    });

    document.querySelector("#likeBtn").addEventListener('click', () => {
        like();
    });

    //pop and push state
    history.pushState({}, "", "");
    window.addEventListener("popstate", () => { closeSheet() });

    //Searching and stuff
    document.querySelector("#searchPage").addEventListener('click', () => {
        document.querySelector(`#search`).parentElement.classList.remove("hidden");
        document.querySelector(`#pageTitle`).classList.add("hidden");
        document.querySelector(`#likedPage`).classList.add("hidden");
    });

    document.querySelector("#search").addEventListener('keyup', () => {
        resetTabs();
        hideAll();
        searchText = document.querySelector("#search").value;

        if (searchText != "") {
            posts.forEach(post => {
                if (post.title.toLowerCase().includes(searchText)) {
                    document.querySelector(`#${post.name}`).classList.remove("hidden");
                } else {
                    document.querySelector(`#${post.name}`).classList.add("hidden");
                }
            });
        } else {
            showAll();
        }
    });
}

//functions

function setClick() {
    let content = document.querySelectorAll(".mdc-image-list__item");

    content.forEach(element => {
        element.addEventListener('click', () => {
            openSheet(element);
        });
    });
}

function openDrawer() {
    drawer.open = true
}

function closeDrawer() {
    drawer.open = false
}

function openSheet(element) {
    document.querySelector(`.sheet`).classList.remove("sheet-out-of-view");

    document.querySelector("#postTitle").innerHTML = element.childNodes[1].title;
    let postName = document.querySelector("#postTitle").innerHTML;

    //make this a function
    posts.forEach(post => {
        if (post.name == postName) {

            document.querySelector("#sheetName").innerHTML = post.name;
            document.querySelector("#sheetTitle").innerHTML = post.title;
            document.querySelector("#userData").innerHTML = "Posted by: " + post.poster;
            document.querySelector("#sheetContent").innerHTML = post.content;

            if (post.catagory == "art") {
                document.querySelector("#artImage").classList.remove("hidden");
                document.querySelector("#artImage").src = post.src;

            } else if (post.catagory == "blog" || post.catagory == "trick") {
                document.querySelector("#sheetTitle").classList.remove("hidden");
                document.querySelector("#sheetDescription").classList.remove("hidden");

                document.querySelector("#sheetTitle").innerHTML = post.title;
                document.querySelector("#sheetDescription").innerHTML = post.description;
            }
        }
    });

    document.querySelector('.sheet').classList.add('noScroll');
}

function closeSheet() {
    document.querySelector(`.sheet`).classList.add("sheet-out-of-view");

    document.querySelector('.sheet').classList.remove('noScroll');

    document.querySelector("#sheetTitle").classList.add("hidden");
    document.querySelector("#sheetDescription").classList.add("hidden");
    document.querySelector("#artImage").classList.add("hidden");
}

function resetTabs() {
    removeActive("art");
    removeActive("trick");
    removeActive("blog");
    document.querySelector("#pageTitle").innerHTML = "Home";
}

function addActive(type) {
    document.querySelector(`#${type}Tab`).classList.add("mdc-tab--active");
    document.querySelector(`#${type}Underline`).classList.add("mdc-tab-indicator--active");
}

function removeActive(type) {
    document.querySelector(`#${type}Tab`).classList.remove("mdc-tab--active");
    document.querySelector(`#${type}Underline`).classList.remove("mdc-tab-indicator--active");
}

function hideAll() {
    let key = 0;

    hideNshow(art, key);
    hideNshow(blog, key);
    hideNshow(trick, key);
}

function showAll() {
    let key = 1;

    hideNshow(art, key);
    hideNshow(blog, key);
    hideNshow(trick, key);
}

function hideNshow(type, key) {
    if (key == 0) {
        for (let i = 0; i < type.length; i++) {
            type[i].classList.add("hidden");
        }
    } else if (key == 1) {
        for (let i = 0; i < type.length; i++) {
            type[i].classList.remove("hidden");
        }
    }
}

//all the like functions
function like() {

    let likedPost = document.querySelector("#sheetName").innerHTML;
    if (document.querySelector(`#${likedPost}`).classList.contains("liked")) {

        //gets the position of the element in the array and then removes it
        document.querySelector(`#${likedPost}`).classList.remove("liked");
        let toRemove = likedPosts.indexOf(likedPost);
        likedPosts.splice(toRemove, 1);
    } else {
        document.querySelector(`#${likedPost}`).classList.add("liked");
        likedPosts.push(likedPost);
    }

    window.sessionStorage.clear();
    window.sessionStorage.setItem("likedPosts", likedPosts)
}

function getLike() {

    //this gets name from the sheet so it can be stored in a session
    if (sessionStorage.getItem("likedPosts") != null) {
        likedPosts = sessionStorage.getItem("likedPosts").split(",");

        if (likedPosts.length > 1) {
            for (let i = 0; i < likedPosts.length; i++) {
                if (likedPosts[i] != '') {
                    document.querySelector(`#${likedPosts[i]}`).classList.add("liked");
                }
            }
        }
    }

}

// get stuff from JSON file
async function getData() {
    fetch('sample.json')
        .then(response => response.json()) // Parse JSON
        .then(data => saveData(data)) // Work with JSON data
        .catch(error => console.error('Error fetching JSON:', error));

}

function saveData(data) {
    posts = data;
    makePosts();
}

//make function that loops over the data and makes the html yippiieeeee!
function makePosts() {
    const list = document.createElement('ul');
    list.classList.add('mdc-image-list');
    list.classList.add('mdc-image-list--masonry');
    list.classList.add('my-masonry-image-list');

    let html;

    posts.forEach(element => {
        // art blog trick
        if (element.catagory == "art") {
            html = makeArtHtml(element);
        } else if (element.catagory == "blog") {
            html = makeBlogHtml(element);
        } else if (element.catagory == "trick") {
            html = makeTrickHtml(element);
        }
        list.innerHTML += html
    });

    document.querySelector("#content").append(list);

    art = document.querySelectorAll(".art");
    blog = document.querySelectorAll(".blog");
    trick = document.querySelectorAll(".trick");


    setClick();
    getLike();
}

function makeArtHtml(post) {
    const html =
        `<li class="post mdc-image-list__item ${post.catagory}" id="${post.name}">
            <img class="mdc-image-list__image sheetImg" src="${post.src}" title="${post.name}">
            <div class="mdc-image-list__supporting">
            </div>
        </li>`;
    return html;
}

function makeBlogHtml(post) {
    //discription and content
    const html =
        `<li class="post mdc-image-list__item ${post.catagory}" id="${post.name}">
            <h2 class="txtCenter" title="${post.name}">${post.title}</h2>
            <p class="txtCenter">${post.description}</p>
            <div class="mdc-image-list__supporting">
            </div>
        </li>`;
    return html;

}

function makeTrickHtml(post) {
    const html =
        `<li class="post mdc-image-list__item ${post.catagory}" id="${post.name}">
            <h2 class="txtCenter" title="${post.name}">${post.title}</h2>
            <p class="txtCenter">${post.description}</p>
            <div class="mdc-image-list__supporting">
            </div>
        </li>`;
    return html;

}