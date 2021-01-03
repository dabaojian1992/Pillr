import { Subject } from 'rxjs';

const subject = new Subject();

export const switches = {
    sendOpen: room => subject.next(room ),
    receiveOpen: () => subject.asObservable()
};