class ApiResponse{
    constructor(statusCode, data, message="Successfully Executed"){
        this.statuscode= statusCode,
        this.data=data,
        this.message=message
    }
}
export default ApiResponse