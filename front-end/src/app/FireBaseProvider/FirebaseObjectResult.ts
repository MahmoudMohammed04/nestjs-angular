export class firebaseObjectResult<T = any>{
    error?: any;
    data?: T;
    success: boolean = false;
    errorMessage?: string | null;

    constructor(error: any, data: T, success: boolean, errorMessage: string | null = null){
        this.error = error;
        this.data = data;
        this.success = success;
        this.errorMessage = errorMessage
    }
}