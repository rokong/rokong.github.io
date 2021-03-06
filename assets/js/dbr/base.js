const CORS_URL = 'https://cors-anywhere-rokong.herokuapp.com/';

export const repo = {
    request : function(url){
        return new Promise(function (resolve) {
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
    },
    ajax : function(url){
        return this.request(CORS_URL+url);
    },
    db : function(){
        const dbName = 'dbr';

        return new Promise((resolve, reject) => {
            let request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = function(ev){
                let db = ev.target.result;

                //create archive if not exists
                if(!db.objectStoreNames.contains('archive')){
                    let archiveStore = db.createObjectStore('archive', {keyPath:'pubNumber'});
                }

                //create single if not exists
                if(!db.objectStoreNames.contains('singleStore')){
                    let singleStore = db.createObjectStore('single', {keyPath:'id'});
                    singleStore.createIndex('pubNumber', 'pubNumber', {unique:false});
                }

                //create recent if not exists
                if(!db.objectStoreNames.contains('recent')){
                    let recentStore = db.createObjectStore('recent', {autoIncrement:true});
                    recentStore.createIndex('articleId', 'id', {unique:false});
                }
            };
            request.onsuccess = function(ev){
                resolve(ev.target.result);
            };
            request.onerror = function(ev){
                console.error('failed to open indexedDB', ev);
                reject(ev);
            };
        });
    },
    tx : function(mode){
        return this.db().then((db)=> {
            let tx = db.transaction(['archive', 'single', 'recent'], mode || 'readwrite');
            tx.onerror = function (ev) {
                console.error('failed to add into indexedDB', ev);
            };
            return tx;
        });
    },
    insert : function(name, value){
        this.tx().then((tx)=>{
            let objStore = tx.objectStore(name);
            objStore.add(value);
        });
    },
    getValueByKey : function(name, key){
        return this.tx('readonly').then((tx)=>{
            let objStore = tx.objectStore(name);
            return new Promise(((resolve, reject) => {
                let request = objStore.get(key);
                request.onsuccess = function(ev){
                    resolve(request.result);
                };
                request.onerror = function(ev){
                    console.error('failed to get from indexedDB', ev);
                    reject(ev);
                };
            }));
        });
    },
    getValueByIndex : function(name, indexName, key){
        return this.tx('readonly').then((tx)=>{
            let objStore = tx.objectStore(name);
            let index = objStore.index(indexName);
            return new Promise(((resolve, reject) => {
                let request = index.get(key);
                request.onsuccess = function(ev){
                    resolve(request.result);
                };
                request.onerror = function(ev){
                    console.error('failed to get from indexedDB', ev);
                    reject(ev);
                };
            }));
        });
    },
    getMaxValue : function(name){
        return this.tx('readonly').then((tx) => {
            let objStore = tx.objectStore(name);
            return new Promise(((resolve, reject) => {
                let request = objStore.openCursor(null, 'prev');
                request.onsuccess = function(ev){
                    let cursor = ev.target.result;
                    if(cursor){
                        resolve(cursor.value);
                    }else{
                        resolve();
                    }
                };
                request.onerror = function(ev){
                    alert('failed to get max value from indexedDB', ev);
                    reject(ev);
                };
            }));
        });
    },
    getMinValue : function(name){
        return this.tx('readonly').then((tx) => {
            let objStore = tx.objectStore(name);
            return new Promise(((resolve, reject) => {
                let request = objStore.openCursor(null, 'next');
                request.onsuccess = function(ev){
                    let cursor = ev.target.result;
                    if(cursor){
                        resolve(cursor.value);
                    }else{
                        resolve();
                    }
                };
                request.onerror = function(ev){
                    alert('failed to get min value from indexedDB', ev);
                    reject(ev);
                };
            }));
        });
    },
    getTopOf : function(name, n){
        return this.tx('readonly').then((tx) => {
            let objStore = tx.objectStore(name);
            return new Promise(((resolve, reject) => {
                let objectList = [];
                let request = objStore.openCursor(null, 'prev');
                request.onsuccess = function(ev){
                    let cursor = ev.target.result;

                    if(objectList.length >= n){
                        resolve(objectList);
                    }else if(cursor){
                        objectList.push(cursor.value);
                        cursor.continue();
                    }else{
                        resolve(objectList);
                    }
                };
                request.onerror = function(ev){
                    alert('failed to get top of n value from indexedDB', ev);
                    reject(ev);
                };
            }));
        });
    },
    put : function(name, value){
        this.tx().then((tx)=>{
            let objStore = tx.objectStore(name);
            objStore.put(value);
        });
    },

};

export const common = {
    getIdByHash : function(hash){
        return hash.replace(/#\/(\d+).*/g, '$1');
    },
    removeAllChildren : function(element){
        while(element.firstChild){
            element.firstChild.remove();
        }
    },
    getDocumentTitle : function(title){
        return `${title} | 전략처럼 행동하기`;
    },
    showToastIcon : function(iconClass){
        const icons = document.querySelectorAll('.toast-btn > *');
        icons.forEach(e => {
            if(e.className.indexOf(iconClass) === -1){
                e.style.display = 'none';
            }else{
                e.style.display = '';
            }
        });
    },
    showLoading : function(isLoading){
        const loadingIcon = document.querySelector('.toast-btn .fa-sync-alt');

        if(isLoading){
            loadingIcon.className += ' rotate';

        }else{
            loadingIcon.className = loadingIcon.className.replace(/\srotate$/g, '');
        }
    }
};

export const recent = {
    displayCount: 3,
    push : function(article){
        repo.getValueByIndex('recent', 'articleId', article.id).then((e)=>{
            if(e === undefined){
                repo.insert('recent', article);
            }else{
                //TODO delete then insert
            }
        });

    },
    get : function(n){
        return repo.getTopOf('recent',n || this.displayCount);
    }
};