export namespace PathService {
    export function getAbsoluteGameElementPath(gameKey:string, fileName:string): any {
        return 'http://localhost:3699/' + gameKey + '/' + fileName;
    }
}