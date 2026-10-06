import storageService from "./storageService";

const KEY = "labSessions";

const labSessionService = {

    getAll(){

        return storageService.get(KEY) || [];

    },

    saveAll(data){

        storageService.save(KEY,data);

    }

};

export default labSessionService;