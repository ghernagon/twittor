// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js',
    'css/animate.css'
];


self.addEventListener('install', event => {
    const cacheStaticProm = caches.open( STATIC_CACHE ).then( cache => cache.addAll(APP_SHELL) );
    const cacheInmutableProm = caches.open( INMUTABLE_CACHE ).then( cache => cache.addAll(APP_SHELL_INMUTABLE) );

    event.waitUntil( Promise.all([cacheStaticProm, cacheInmutableProm]));
});

self.addEventListener('activate', event => {
    // Limpiar los caches estaticos antiguos
    const resp = caches.keys().then( keys => {
        keys.forEach( key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    
    event.waitUntil(resp);
});

self.addEventListener('fetch', event => {
    const resp = caches.match( event.request ).then( resp => {
        if (resp) {
            return resp;
        } else {
            // Network fallback
            return fetch( event.request ).then( newResp => {
                return updateDynamicCache( DYNAMIC_CACHE, event.request, newResp);
            });
        }
    });
    event.respondWith( resp );
});