import express from 'express';
import { LinkTypes } from './link_types/types';
import { DependenciesMap } from './link_types/all_links';
import { createLink, Dependencies, getByUserId, ThirdPartyDepdencies } from './link/link';
import * as common from './link_types/common';

const port = 3000;
const app = express()

type types = keyof typeof LinkTypes;
app.post("/link/:type", (req, res) => {
    // TODO: Does the type parameter need to be sanitized??
    // Put it to uppercase due to how the enum index signatures work
    const typeOfLink = LinkTypes[req.params.type.toUpperCase() as types];
    if(typeOfLink){
        const deps: Dependencies & ThirdPartyDepdencies = {
            ...DependenciesMap.get(typeOfLink)!,
            save: common.save,
            getByUserId: common.getByUserId
        }
        // TODO: This should be sanitized properly before passing in
        if(createLink(req.body, deps)){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    }else{
        res.statusCode = 400;
        res.send("Couldn't find the link type");
    }
});
app.get("/link/:userId", (req, res) => {
    const deps: ThirdPartyDepdencies = {
        getByUserId: common.getByUserId,
        save: common.save
    }
    const links = getByUserId(req.params.userId, deps);
    // TODO: This should be sanitized before sending back out. Can't trust what is in the store
    res.send(links);
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})
