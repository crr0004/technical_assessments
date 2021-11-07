export class FileNotFound {

}
export class InvalidFormat {
    message: string;
    constructor(message: string){
        this.message = message;
    }
}

export class InvalidLineFormat extends InvalidFormat{
    line: string;
    match: RegExp;
    constructor(message: string, line: string, match: RegExp){
        super(`${message}. Details are as follows. Line: ${line} should match ${match}`);
        this.line = line;
        this.match = match;
    }
}