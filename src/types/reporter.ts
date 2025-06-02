import { TFileDocument } from "./global";

export interface GenericReporter {
    id: string;
    name: string;
    designation: string;
    photo: TFileDocument | null;
}