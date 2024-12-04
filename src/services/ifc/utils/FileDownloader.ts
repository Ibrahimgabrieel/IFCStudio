import { IFileDownloader } from '../interfaces/IFileDownloader';

export class FileDownloader implements IFileDownloader {
    download(file: File): void {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}