import storageService from "./storageService";

const KEY = "students";

const studentService = {

    getStudents(){

        return storageService.get(KEY) || [];

    },

    saveStudents(students){

        storageService.save(

            KEY,

            students

        );

    }

};

export default studentService;