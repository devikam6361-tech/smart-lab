const storageService = {

    get(key){

        const data = localStorage.getItem(key);

        if(!data) return null;

        return JSON.parse(data);

    },

    save(key,value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    remove(key){

        localStorage.removeItem(key);

    },

    clear(){

        localStorage.clear();

    }

};

export default storageService;