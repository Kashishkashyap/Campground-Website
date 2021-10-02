class expressErrors extends Error{
    constructor(message, statusCode){
        super();
        this.message= message;
        this.statusCode= statusCode;
    }
}
module.exports = expressErrors;