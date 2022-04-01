function updateDynamicCache( cache, req, resp ) {
    if (resp.ok) {
        return caches.open(cache).then(c => { 
            c.put(req, resp.clone()); 
            return resp.clone();
        });
    } else {
        return resp;
    }
};