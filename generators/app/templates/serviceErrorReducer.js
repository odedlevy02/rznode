/* istanbul ignore file */
//a class for extracting the response from an http request
//Modify this logic according to your needs
export const serviceErrorReduce=(err)=>{
    if(err.response && err.response.body && err.response.body.error && err.response.body.error.message) {
        return err.response.body.error.message;
    }
    else if(err.response && err.response.body && err.response.body.error && Object.keys(err.response.body.error).length) {
        return err.response.body.error;
    }
    else if(err.response && err.response.body && err.response.body.message){
        return  err.response.body.message;
    }
    else if(err.response && err.response.error && err.response.error.message){
        return  err.response.error.message;
    }
    else{
        return err.message
    }

}