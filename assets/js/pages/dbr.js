const CORS_URL = 'https://cors-anywhere-rokong.herokuapp.com/';

const repo = {
    ajaxRequest : function(url){
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    resolve(this.response);
                } else {
                    console.log("We reached our target server, but it returned an error");
                }
            }
            request.onerror = function () {
                console.log("There was a connection error of some sort");
            }
            request.send();
        });
    }
};

let archive = (function(){

    function setPage(pub) {
        setHeader(pub);
        setBody(pub);
        setFooter(pub);
    }

    function setHeader(pub) {
        document.title = pub.title + ' ' + document.title.trim();
        document.getElementById('page-title').innerText = pub.title;
        document.querySelector('.page__lead').innerText = getExcerpt(pub);
        document.querySelector('.page__meta-date time').innerText = pub.pubDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
        setHeaderImage(pub);
    }

    function getExcerpt(pub) {
        return `DBR ${pub.pubNumber}호 / ${pub.pubInfo}`;
    }

    function setHeaderImage(pub) {
        let header = document.querySelector('.page__hero--overlay');
        let backgroundImage = header.style['background-image'];
        backgroundImage = backgroundImage.replace(/url\(.*\)/g, `url('${pub.cover}')`);
        header.style['background-image'] = backgroundImage;
        header.style['background-size'] = '115%';
    }

    function setBody(pub) {
        let template = document.getElementById('articleEl');
        let ulWrapper = document.createElement('ul');
        let articleEl;

        let articleContainer = document.querySelector('.article_list');

        pub.articleList.forEach(function (article, index) {
            articleEl = document.importNode(template.content, true);
            articleEl.querySelector('a').href = single.getUrlByIds(pub.id, article.id);
            articleEl.querySelector('.category').innerText = article.category;
            articleEl.querySelector('.title').innerText = article.title;
            articleEl.querySelector('.name').innerText = article.author;
            ulWrapper.append(articleEl);
        });

        articleContainer.append(ulWrapper);
    }

    function setFooter(pub) {
        let pagination = document.querySelector('.pagination');
        let buttons = pagination.querySelectorAll('a');
        let pubId = parseInt(pub.id);

        buttons[0].href = `${location.origin}/dbr-archive/#/${pubId - 1}`;

        if (pub.nextPubNumber !== '') {
            buttons[1].className = buttons[1].className.replace('disabled', '');
            buttons[1].href = `${location.origin}/dbr-archive/#/${pubId + 1}`;
        } else {
            buttons[1].className += ' disabled';
        }
    }

    return {
        getArchive : function(pubId){
            // TODO indexedDB
            let url = location.origin + '/assets/dbr/archive.json';

            return repo.ajaxRequest(url).then(function (response) {
                return JSON.parse(response);
            });
        },
        loadArchive : function(pub){
            setPage(pub);
        },
        getArticleList : function(pubId){
            return this.getArchive(pubId).then(e => {return e.articleList;});
        },
        getUrlById(pubId){
            return `${location.origin}/dbr-archive/#/${pubId}`;
        }
    };
})();


let single = (function(){

    function setPage(article){
        setHeader(article);
        document.querySelector('.article_body').innerHTML = article.body;
    }

    function setHeader(article) {
        document.title = article.title + ' ' + document.title.trim();
        document.getElementById('page-title').innerText = article.title;
        document.querySelector('.page__lead').append(getExcerpt(article));
        //setHeaderImage(pub);
    }

    function getExcerpt(article){
        let template = document.getElementById('excerpt');
        let excerpts = document.importNode(template.content, true);
        excerpts.querySelector('.pub_info').innerText = article.pubInfo;
        excerpts.querySelector('.author').innerText = article.author;
        return excerpts.querySelector('div');
    }

    function setRelated(article, articles) {
        //set page__related-title
        let titleEl = document.querySelector('.page__related-title a');
        titleEl.innerText = article.pubInfo;
        titleEl.setAttribute('href', archive.getUrlById(article.pubId));

        let template = document.getElementById('gridItem');
        let gridWrapper = document.querySelector('.grid__wrapper');
        let gridItem;

        articles.forEach(e => {
            gridItem = document.importNode(template.content, true);

            gridItem.querySelector('.archive__item-title a').setAttribute(
                'href', single.getUrlByIds(e.pubId, e.id));
            gridItem.querySelector('.archive__item-title a .category').innerText = e.category;
            gridItem.querySelector('.archive__item-title a .title').innerText = e.title;
            gridItem.querySelector('.archive__item-title a .name').innerText = e.author;

            gridWrapper.append(gridItem);
        });
    }

    return {
        getSingle : function(pubId, articleId){
            // TODO indexedDB
            let url = location.origin + '/assets/dbr/single.json';

            return repo.ajaxRequest(url).then(response => {
                return JSON.parse(response);
            });
        },
        loadSingle : function(article){
            setPage(article);
        },
        loadNextSingles : function(article){
            return archive.getArticleList(article.pubId).then(articles => {
                let nextArticles = [];
                for(let i in articles){
                    if(article.id <= articles[i].id) continue;
                    nextArticles.push(articles[i]);
                    if(nextArticles.length === 4) break;
                }
                return nextArticles;

            }).then(articleList => {setRelated(article, articleList)});
        },
        getUrlByIds : function(pubId, articleId) {
            return `${location.origin}/dbr-single/#/${pubId}/${articleId}`;
        }
    }

})();