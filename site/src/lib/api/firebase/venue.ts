import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { COLL_VENUES, COLL_VENUE_SUBMISSIONS, SUB_COLL_SEMESTERS, db } from '.';
import type { Lesson, Venue } from '$lib/types/Firebase';
import type { VenueSubmissionStored, VenueSubmissionUpdate } from '$lib/types/Venue';

/**
 * Tries to find the module with the provided parameters.
 * @param venue Venue to find.
 * @param semesterId Target semester of the lessons for the module. In YYYY;S format.
 * @returns Module document or undefined if it was not found.
 */
export async function getVenueLessons(venue: string, semesterId: string) {
    // First find the main document of the module
    const venuesCollection = collection(db, COLL_VENUES);
    const venuesQuery = query(venuesCollection, where('name', '==', venue));
    const querySnapshot = await getDocs(venuesQuery);
    const documents = querySnapshot.docs;
    if (documents.length === 0) return undefined;

    // Find all lessons for that venue for the currently selected semester
    let lessons: Lesson[] = [];
    const lessonsRef = doc(db, COLL_VENUES, documents[0].id, SUB_COLL_SEMESTERS, semesterId);
    const lessonsDoc = await getDoc(lessonsRef);
    if (lessonsDoc.exists()) lessons = lessonsDoc.data().lessons;

    const document = { ...documents[0].data(), lessons } as Venue;
    return document;
}

/**
 * Submits venue contribution onto Firestore.
 * @param venue Venue user contributed to.
 * @param floor Floor of the venue.
 * @param comments Things to note about the venue.
 * @param lat
 * @param lng
 * @returns Error if submission failed.
 */
export async function submitVenueLocation(
    venue: string,
    floor: number,
    comments: string,
    lat: number,
    lng: number
) {
    const cityRef = doc(
        db,
        COLL_VENUE_SUBMISSIONS,
        `${venue}_${Math.floor(new Date().getTime() / 1000)}`
    );

    try {
        await setDoc(cityRef, { venue, floor, comments, lat, lng, confirmed: false });
    } catch (err) {
        return err;
    }

    return;
}

/**
 * Retrieves all unconfirmed venue submissions for admin the approve/disapprove.
 * @returns All unconfirmed venue submissions.
 */
export async function getVenueSubmissions() {
    const venuesSubsCollection = collection(db, COLL_VENUE_SUBMISSIONS);
    const venuesQuery = query(venuesSubsCollection, where('confirmed', '==', false));
    const querySnapshot = await getDocs(venuesQuery);
    const documents = querySnapshot.docs;
    const venueSubmissions = documents.map((doc) => {
        return { id: doc.id, ...doc.data() } as VenueSubmissionStored;
    });
    return venueSubmissions;
}

export async function updateVenueSubmission(submissionUpdate: VenueSubmissionUpdate) {
    const { approved, venue, lat, lng } = submissionUpdate;

    const submissionRef = doc(db, COLL_VENUE_SUBMISSIONS, submissionUpdate.id);
    const submissionDoc = await getDoc(submissionRef);
    if (!submissionDoc.exists()) return false;

    const updatedDoc = { ...submissionUpdate, confirmed: true };
    await setDoc(submissionRef, updatedDoc);

    if (approved) {
        const venueRef = doc(db, COLL_VENUES, venue);
        const venueDoc = await getDoc(venueRef);
        if (!venueDoc.exists()) return false;
        const updatedVenue = { ...venueDoc.data(), lat, lng, coord_confirmed: true } as Venue;
        await setDoc(venueRef, updatedVenue);
    }

    return true;
}
