export namespace PathService {
    export function getAbsoluteGameElementPath(gameKey:string, fileName:string): any {
        return document.location.protocol + '//' + document.location.hostname + ':3699/' + gameKey + '/' + fileName;
    }
}