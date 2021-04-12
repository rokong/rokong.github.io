const CORS_URL = 'https://cors-anywhere-rokong.herokuapp.com/';

export const repo = {
    ajaxRequest : function(corsURL){
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open('GET', corsURL, true);
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
        return this.ajaxRequest(CORS_URL+url);
    },
    db : function(){
        const dbName = 'dbr';

        return new Promise((resolve, reject) => {
            let request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = function(ev){
                let db = ev.target.result;

                //create archive if not exists
                if(!db.objectStoreNames.contains('archive')){
                    let archiveStore = db.createObjectStore('archive', {keyPath:'id'});
                    archiveStore.createIndex('pubNumber', 'pubNumber', {unique: true});
                }

                //create single if not exists
                if(!db.objectStoreNames.contains('singleStore')){
                    let singleStore = db.createObjectStore('single', {keyPath:'id'});
                    singleStore.createIndex('pubId', 'pubId', {unique: false});
                }

                resolve(db);
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
            let tx = db.transaction(['archive', 'single'], mode || 'readwrite');
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
                    console.error('failed to get max value from indexedDB', ev);
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