import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { COLL_VENUES, COLL_VENUE_SUBMISSIONS, SUB_COLL_SEMESTERS, db } from '.';
import type { Lesson, Venue } from '$lib/types/Firebase';

/**
 * Tries to find the module with the provided parameters
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
 * @returns Error if submission failed
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
        await setDoc(cityRef, { venue, floor, comments, lat, lng });
        return;
    } catch (err) {
        console.log(err);
        return err;
    }

    return;
}
