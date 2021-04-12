import {repo} from "./repo.js";
import {archive} from './archive.js';

export const single = (function(){

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