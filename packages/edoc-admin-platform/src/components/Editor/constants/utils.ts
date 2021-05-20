export function dataUrlReader(file: File, callback: (result: string | ArrayBuffer | null) => void) {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', event => {
        if (!!event.target) {
            callback(event.target.result);
        } else {
            callback(null);
        }
    });

    fileReader.readAsDataURL(file);
}