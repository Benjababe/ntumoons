export type VenueSubmissionReq = {
    name: string;
    lat: number;
    lng: number;
    floor: number;
    comments: string;
};

export type VenueSubmissionStored = {
    venue: string;
    lat: number;
    lng: number;
    floor: number;
    confirmed: boolean;
    comments: string;
};
