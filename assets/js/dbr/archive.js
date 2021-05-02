import {repo, common} from "./base.js";
import {single} from './single.js';

export const archive = (function(){

    function setPage(pub) {
        setHeader(pub);
        setBody(pub);
        setFooter(pub);
    }

    function setHeader(pub) {
        document.title = common.getDocumentTitle(pub.title);
        document.getElementById('page-title').innerText = pub.title;
        document.querySelector('.page__lead').innerText = getExcerpt(pub);

        let metaTime = document.querySelector('.page__meta-date time');
        metaTime.setAttribute('datetime', pub.pubDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3T00:00:00+09:00'));
        metaTime.innerText = pub.pubDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');

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
        common.removeAllChildren(articleContainer);

        pub.articleList.forEach(function (article, index) {
            articleEl = document.importNode(template.content, true);
            articleEl.querySelector('a').href = single.getUrlById(article.id);
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
        let pubNumber = parseInt(pub.pubNumber);

        buttons[0].href = `${location.origin}/dbr-archive/#/${(pubNumber - 1)}`;

        if (pub.nextPubNumber !== '') {
            buttons[1].className = buttons[1].className.replace('disabled', '');
            buttons[1].href = `${location.origin}/dbr-archive/#/${pubNumber + 1}`;
        } else {
            buttons[1].className += ' disabled';
        }
    }

    function parseArchive(response){
        let resp = response;
        resp = resp.replace(/="\//g, "=\"https://dbr.donga.com/");
        resp = resp.replace(/[sS][rR][cC]=["][^"]*"/g, "data-$&");

        let respHtml = document.createElement('html');
        respHtml.innerHTML = resp;
        let html = respHtml.querySelector('div.view4');

        let archive = {};
        //magazine_info
        archive['pubNumber'] = html.querySelector('.magazine_info .num').innerText.replace(/\D/g, '');
        archive['title'] = html.querySelector('.magazine_info .title').innerText;
        archive['cover'] = html.querySelector('.magazine_info .img img').getAttribute('data-src');

        //pubInfo, pubDate
        let pubInfo = html.querySelector('.magazine_info .con').innerText.trim();
        archive['pubInfo'] = pubInfo.split('\n')[0].replace(/.* : (.*)\s/g, '$1').trim();
        archive['pubDate'] = pubInfo.replace(/\D/g, '').replace(/.*(\d{8})$/g, '$1').trim();

        let articleList = [];
        let articleNodes = html.querySelectorAll('.article_list ul li a');
        articleNodes.forEach(function(node){
            let article = {};
            article.id = node.href.replace(/.*article_no\/(\d+)\/ac\/magazine/g, '$1');
            article.category = node.children[0].innerText.trim();
            article.title = node.children[1].innerText.replaceAll(/\n/g, ' ').trim();
            article.author = node.children[2].innerText.trim();
            articleList.push(article);
        });
        archive['articleList'] = articleList;

        //prev, next pubNumber
        html = respHtml.querySelector('div.board-btn');
        let btnHref = html.querySelector('.board-btn a:first-child').getAttribute('href');
        archive['prevPubNumber'] = btnHref.replace(/\D/g, '');
        btnHref = html.querySelector('.board-btn a:last-child').getAttribute('href');
        archive['nextPubNumber'] = btnHref.replace(/\D/g, '');

        return archive;
    }

    function getArchiveFromIDB(pubNumber){
        if(pubNumber === undefined || pubNumber === '' || pubNumber === null){
            return repo.getMaxValue('archive');
        }else{
            return repo.getValueByKey('archive', pubNumber);
        }
    }

    return {
        updateArchive : function(pubNumber){
            const archiveUrl = `https://dbr.donga.com/magazine/mcontents/pub_number/${pubNumber || ''}`;
            return repo.ajax(archiveUrl).then(function(response){
                return response;
            }).then((response) => {
                let archive = parseArchive(response);
                repo.put('archive', archive);
                return archive;
            });
        },
        getArchive : function (pubNumber){
            return getArchiveFromIDB(pubNumber).then((pub)=>{
                if(pub !== undefined){
                    return new Promise(resolve => {resolve(pub);});
                }else{
                    return this.updateArchive(pubNumber);
                }
            });
        },
        loadArchive : function(pubNumber){
            return this.getArchive(pubNumber).then(setPage);
        },
        reloadArchive : function(pubNumber){
            return this.updateArchive(pubNumber).then(setPage);
        },
        getArticleList : function(pubNumber){
            return this.getArchive(pubNumber).then(e => {return e.articleList;});
        },
        getUrlByPubNumber(pubNumber){
            return `${location.origin}/dbr-archive/#/${pubNumber}`;
        },
        getPubNumberByHash(hash){
            return hash.replace(/#\/(\d+).*/g, '$1');
        }
    };
})();