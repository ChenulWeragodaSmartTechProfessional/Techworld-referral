// Referral System
// ================
// This file handles referral tracking and points management

import { db } from "./firebase.js";
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  increment
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Get referral code from URL parameter
export function getReferralCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

// Build referral link for user
export function buildReferralLink(refCode) {
  const baseURL = window.location.origin + window.location.pathname.replace(/[^/]*\.html$/, "") + "join.html";
  return `${baseURL}?ref=${refCode}`;
}

// Find user by referral code
export async function findUserByRefCode(refCode) {
  try {
    const q = query(collection(db, "users"), where("refCode", "==", refCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid referral code" };
    }

    const userData = querySnapshot.docs[0].data();
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error finding referral code:", error.message);
    return { success: false, error: error.message };
  }
}

// Record referral (when new user joins through referral link)
export async function recordReferral(referrerUid, newUserUid) {
  try {
    // Add referral record to referrals collection
    await addDoc(collection(db, "referrals"), {
      referrerUid: referrerUid,
      newUserUid: newUserUid,
      date: new Date(),
      status: "completed"
    });

    // Add points to referrer (10 points per referral)
    await updateDoc(doc(db, "users", referrerUid), {
      points: increment(10)
    });

    console.log("Referral recorded successfully");
    return { success: true };
  } catch (error) {
    console.error("Error recording referral:", error.message);
    return { success: false, error: error.message };
  }
}

// Get referrals count for user
export async function getUserReferralsCount(uid) {
  try {
    const q = query(collection(db, "referrals"), where("referrerUid", "==", uid));
    const querySnapshot = await getDocs(q);
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error("Error getting referrals count:", error.message);
    return { success: false, error: error.message };
  }
}

// Get referral history for user
export async function getUserReferralHistory(uid) {
  try {
    const q = query(collection(db, "referrals"), where("referrerUid", "==", uid));
    const querySnapshot = await getDocs(q);

    const referrals = [];
    for (const docSnap of querySnapshot.docs) {
      const referralData = docSnap.data();
      
      // Get new user details
      const newUserDoc = await getDoc(doc(db, "users", referralData.newUserUid));
      if (newUserDoc.exists()) {
        referrals.push({
          id: docSnap.id,
          referrerName: referralData.referrerName,
          newUserName: newUserDoc.data().name,
          newUserEmail: newUserDoc.data().email,
          date: referralData.date.toDate(),
          status: referralData.status
        });
      }
    }

    return { success: true, referrals: referrals };
  } catch (error) {
    console.error("Error getting referral history:", error.message);
    return { success: false, error: error.message };
  }
}

// Get user points
export async function getUserPoints(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, points: userDoc.data().points || 0 };
    }
    return { success: false, error: "User not found" };
  } catch (error) {
    console.error("Error getting user points:", error.message);
    return { success: false, error: error.message };
  }
}

// Check if referral already exists (prevent duplicate referrals)
export async function checkReferralExists(referrerUid, newUserUid) {
  try {
    const q = query(
      collection(db, "referrals"),
      where("referrerUid", "==", referrerUid),
      where("newUserUid", "==", newUserUid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error("Error checking referral:", error.message);
    return false;
  }
}
