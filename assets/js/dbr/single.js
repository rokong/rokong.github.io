import {repo, common} from "./base.js";
import {archive} from './archive.js';

export const single = (function(){

    function setPage(article){
        setHeader(article);

        let articleBody = document.querySelector('.article_body');
        common.removeAllChildren(articleBody);
        articleBody.innerHTML = article.body;
    }

    function setHeader(article) {
        document.title = common.getDocumentTitle(article.title);
        document.getElementById('page-title').innerText = article.title;

        let pageLead = document.querySelector('.page__lead');
        pageLead.innerHTML = getExcerptHTML(article);
    }

    function getExcerptHTML(article){
        let template = document.getElementById('excerpt');
        let excerpts = document.importNode(template.content, true);

        let pubInfo = excerpts.querySelector('.pub_info');
        pubInfo.setAttribute('href', archive.getUrlByPubNumber(article.pubNumber));
        pubInfo.innerText = article.pubInfo;

        if(article.author !== ''){
            excerpts.querySelector('.author').innerText = article.author;
        }else{
            //if author is empty, remove author
            excerpts.querySelector('.author').remove();
            excerpts.querySelector('.fa-user').remove();
        }

        return excerpts.querySelector('div').innerHTML;
    }

    function setRelated(article, articles) {
        //set page__related-title
        let titleEl = document.querySelector('.page__related-title a');
        titleEl.innerText = article.pubInfo;
        titleEl.setAttribute('href', archive.getUrlByPubNumber(article.pubNumber));

        let template = document.getElementById('gridItem');
        let gridWrapper = document.querySelector('.grid__wrapper');
        common.removeAllChildren(gridWrapper);

        let gridItem;
        articles.forEach(e => {
            gridItem = document.importNode(template.content, true);

            gridItem.querySelector('.archive__item-title a').setAttribute(
                'href', single.getUrlById(e.id));
            gridItem.querySelector('.archive__item-title a .category').innerText = e.category;
            gridItem.querySelector('.archive__item-title a .title').innerText = e.title;
            gridItem.querySelector('.archive__item-title a .name').innerText = e.author;

            gridWrapper.append(gridItem);
        });
    }

    function parseSingle(response, articleId){
        let resp = response;
        resp = resp.replace(/="\//g, "=\"https://dbr.donga.com/");
        resp = resp.replace(/[sS][rR][cC]=["][^"]*"/g, "data-$&");
        resp = resp.replace(/<img[^>]*>/g, "<div class='img-wrapper'>$&</div>");

        let respHtml = document.createElement('html');
        respHtml.innerHTML = resp;
        let html = respHtml.querySelector('.pop-cont .top');

        let single = {};
        //articleInfo
        single['id'] = articleId;
        single['pubInfo'] = html.querySelector('.publish-ho').innerText.trim();
        single['pubNumber'] = single['pubInfo'].replace(/^(\d+).*/g, '$1');
        single['title'] = html.querySelector('.title').innerText.replaceAll(/\n/g, ' ').trim();

        let authorEl = html.querySelector('.author .person .name');
        single['author'] = authorEl != null ? authorEl.innerText.trim() : '';

        //articleBody
        html = respHtml.querySelector('.cboth.print-word');
        single['body'] = html.innerHTML;

        return single;
    }

    function getSingleFromIDB(articleId){
        return repo.getValueByKey('single', articleId);
    }

    return {
        updateSingle : function(articleId){
            const singleUrl = `https://dbr.donga.com/article/pop_print/article_no/${articleId}`;
            return repo.ajax(singleUrl).then(function(response){
                return response;
            }).then((response) => {
                let single = parseSingle(response, articleId);
                repo.put('single', single);
                return single;
            });
        },
        getSingle : function(articleId){
            return getSingleFromIDB(articleId).then((article)=>{
                if(article !== undefined){
                    return new Promise(resolve => {resolve(article);});
                }else{
                    return this.updateSingle(articleId);
                }
            });
        },
        loadSingle : function(articleId){
            return new Promise(resolve => {
                this.getSingle(articleId)
                    .then(setPage)
                    .then(resolve);
            });
        },
        loadNextSingles : function(article){
            return archive.getArticleList(article.pubNumber).then(articles => {
                let nextArticles = [];
                for(let i in articles){
                    if(parseInt(articles[i].id) <= parseInt(article.id)) continue;
                    nextArticles.push(articles[i]);
                    if(nextArticles.length === 4) break;
                }
                return nextArticles;

            }).then(articleList => {setRelated(article, articleList)});
        },
        getUrlById : function(articleId) {
            return `${location.origin}/dbr-single/#/${articleId}`;
        }
    }
})();