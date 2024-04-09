export type VenueSubmissionReq = {
    venue: string;
    lat: number;
    lng: number;
    floor: number;
    comments: string;
};

export type VenueSubmissionStored = VenueSubmissionReq & {
    id: string;
    confirmed: boolean;
};

export type VenueSubmissionUpdate = VenueSubmissionStored & {
    approved: boolean;
};
