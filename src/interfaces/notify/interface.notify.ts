export interface INotify {
    sender: {
        name: string;
        profile: string;
    };
    title: string;
    message: string;

    recipient: string;

    read: boolean;
}