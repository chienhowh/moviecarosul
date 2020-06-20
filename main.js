const api_key = "bc0a486e34f46f2e1df814d9d7d35008"
const searchButton = document.querySelector("#search")
const inputText = document.querySelector("#inputValue")
const url ="https://api.themoviedb.org/3/search/movie?api_key=bc0a486e34f46f2e1df814d9d7d35008&query=spiderman"
const image_url = "https://image.tmdb.org/t/p/w300";
const movieBoard = document.querySelector(".movie-display")
const movieUpcoming = document.querySelector(".movie-upcoming")
const movieNowPlaying = document.querySelector(".movie-nowplaying")
const movieTopRated = document.querySelector(".movie-top-rated")
const popup = document.querySelector('.popup')
const trailerBoard = document.querySelector(".trailer")
let trailerSrc

searchButton.addEventListener("click", function(e){
    e.preventDefault()
    const value = inputText.value.trim()
    if(!value) return
    const path = "/search/movie"
    const url = generateUrl(path) + "&query=" + value
    searchMoviesData(url, movieBoard)
    // inputText.value = "";
})

//display poster in board
function searchMoviesData(url, container){
    fetch(url)
        .then((res) =>  res.json())
        .then((data) => {
            const movies = data.results
            let htmlContent = ''
            movies.forEach(movie => { 
                if(movie.poster_path == null) return
                else{
                    htmlContent +=  `
                    <div class="item"><div class="pad15"><img src="${image_url + movie.poster_path}" data-movie-id="${movie.id}"</img></div></div>
                    `
                }
            })
           container.innerHTML = htmlContent
           makeCarousel()
        })
        .catch((err) => console.log(err))
}
//other delegation
function showInPopup(clicked){
    if(clicked.tagName === 'IMG'){
        popup.classList.add('contentdisplay')
        const movieId = clicked.dataset.movieId
        console.log(movieId)
        getTrailerSrc(movieId)
        const path = `/movie/${movieId}`
        const url = generateUrl(path)
        let htmlContent = ''
        fetch(url)
            .then(res => res.json())
            .then(data => {
                        htmlContent = 
                        `
                        <div class="col-md-12"><h1>${data.title}</h1></div>
                        <div class="box-header col-md-6">
                            <img src="${image_url + data.poster_path}" alt="">
                        </div>
                        <div class="box-body col-md-6">
                        <h4><strong>${data.tagline}</strong></h4>
                            <ul class="list-group">
                                <li class="list-group-item "><strong>Genre:</strong>${genres = data.genres.map(genre => genre.name)}</li>
                                <li class="list-group-item "><strong>Released:</strong>${data.release_date}</li>
                                <li class="list-group-item "><strong>Popularity:</strong>${data.popularity}</li>
                                <li class="list-group-item "><strong>Rating:</strong>${data.vote_average}</li>
                                <li class="list-group-item "><strong>Runtime</strong>${data.runtime}</li>
                            </ul>
                        </div>
                        <div class="col-md-12">
                            <h5 class='mt-4'>Overview</h5>
                            <p>${data.overview}</p>
                        </div>
                        <div class="box-footer col-md-12">
                            <a href="http://imdb.com/title/${data.imdb_id}"  class="btn btn-primary" target="_blank">View in IMDB</a>
                            <a href="${trailerSrc}" class="btn btn-primary" target="_blank">View Trailer</a>
                        </div>
                        `
                        trailerBoard.innerHTML = htmlContent
            })
            .catch(err => console.log(err))
    }
}
movieNowPlaying.addEventListener('click', event => {
    const clicked = event.target
    showInPopup(clicked)
})
movieTopRated.addEventListener('click', event => {
    const clicked = event.target
    showInPopup(clicked)
})
movieUpcoming.addEventListener('click', event => {
    const clicked = event.target
    showInPopup(clicked)
})
//click delegation
movieBoard.addEventListener('click', function(event){
    const clicked = event.target
    if(event.target.tagName === 'IMG'){
        popup.classList.add('contentdisplay')
        const movieId = clicked.dataset.movieId
        getTrailerSrc(movieId)
        console.log(trailerSrc)//為什麼第一次是undefined
        const path = `/movie/${movieId}`
        const url = generateUrl(path)
        let htmlContent = ''
        // fetch(urlVideo)
        //     .then((res) => res.json())
        //     .then((data) => {
        //         const trailerId = data.results[0].key
        //         const iframe = document.createElement("iframe")
        //         iframe.src = `https://www.youtube.com/embed/${trailerId}`
        //         iframe.allowFullscreen = true
        //         trailerBoard.append(iframe)
        //     })
        //     .catch((err) => console.log(err))
        fetch(url)
            .then(res => res.json())
            .then(data => {
                        htmlContent = 
                        `
                        <div class="col-md-12"><h1>${data.title}</h1></div>
                        <div class="box-header col-md-6 ">
                            <img src="${image_url + data.poster_path}" alt="">
                        </div>
                        <div class="box-body col-md-6">
                            <h4><strong>${data.tagline}</strong></h4>
                            <ul class="list-group">
                                <li class="list-group-item "><strong>Genre:</strong>${genres = data.genres.map(genre => genre.name)}</li>
                                <li class="list-group-item "><strong>Released:</strong>${data.release_date}</li>
                                <li class="list-group-item "><strong>Popularity:</strong>${data.popularity}</li>
                                <li class="list-group-item "><strong>Rating:</strong>${data.vote_average}</li>
                                <li class="list-group-item "><strong>Runtime</strong>${data.runtime}</li>
                            </ul>
                        </div>
                        <div class="col-md-12">
                            <h5 class='mt-4'>Overview</h5>
                            <p>${data.overview}</p>
                        </div>
                        <div class="box-footer col-md-12">
                            <a href="http://imdb.com/title/${data.imdb_id}"  class="btn btn-primary" target="_blank">View in IMDB</a>
                            <a href="${trailerSrc}" class="btn btn-primary" target="_blank">View Trailer</a>
                        </div>
                        `
                        trailerBoard.innerHTML = htmlContent
            })
            .catch(err => console.log(err))
    }
})
//抓預告網址 

function getTrailerSrc(movieId){
    const pathVideo = `/movie/${movieId}/videos`
    const urlVideo = generateUrl(pathVideo)
    fetch(urlVideo)
            .then((res) => res.json())
            .then((data) => {
                const trailerId = data.results[0].key
                const src = `https://www.youtube.com/embed/${trailerId}`
                trailerSrc = src
            })
            .catch((err) => console.log(err))
}

function generateUrl(path){
    const url = `https://api.themoviedb.org/3${path}?api_key=bc0a486e34f46f2e1df814d9d7d35008`
    return url;
}

//click and close
$('i').on('click', () =>{
    popup.classList.remove('contentdisplay')
})

//make carousel
function makeCarousel() {
    var itemsMainDiv = ('.MultiCarousel');
    var itemsDiv = ('.MultiCarousel-inner');
    var itemWidth = "";

    $('.leftLst, .rightLst').click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition)
            click(0, this);
        else
            click(1, this)
    });

    ResCarouselSize();




    $(window).resize(function () {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() {
        var incno = 0;
        var dataItems = ("data-items");
        var itemClass = ('.item');
        var id = 0;
        var btnParentSb = '';
        var itemsSplit = '';
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $('body').width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "MultiCarousel" + id);


            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () {
                $(this).outerWidth(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");

        });
    }

    //carousel
    //this function used to move the items
    function ResCarousel(e, el, s) {
        var leftBtn = ('.leftLst');
        var rightBtn = ('.rightLst');
        var translateXval = '';
        var divStyle = $(el + ' ' + itemsDiv).css('transform');
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
    }

    //It is used to get some elements from btn
    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

}
//onload
function getNowPlaying(){
    const path = "/movie/now_playing"
    const url = generateUrl(path)
    searchMoviesData(url, movieNowPlaying)
}
function getUpcoming(){
    const path = "/movie/upcoming"
    const url = generateUrl(path)
    searchMoviesData(url, movieUpcoming)
}
function getTopRated(){
    const path = "/movie/top_rated"
    const url = generateUrl(path)
    searchMoviesData(url, movieTopRated)
}
function getSearch(){
    const path = "/search/movie"
    const url = generateUrl(path) + "&query=spiderman"
    searchMoviesData(url, movieBoard)
}
window.onload = function(){
    getSearch()
    getNowPlaying()
    getUpcoming()
    getTopRated()
}

