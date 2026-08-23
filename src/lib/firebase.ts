import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import {
  SiteProfile,
  ProjectItem,
  ProjectImage,
  TimelineItem,
  SkillItem,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_TIMELINE,
  INITIAL_SKILLS,
} from './initialData';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfigData) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with configured databaseId
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ---------------- Site Profile ----------------
const PROFILE_DOC_ID = 'main_profile';

export async function getProfile(): Promise<SiteProfile> {
  try {
    const profileRef = doc(db, 'siteProfile', PROFILE_DOC_ID);
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as SiteProfile) };
    }
  } catch (error) {
    console.warn('Firestore getProfile fallback to initial sample data:', error);
  }
  return { ...INITIAL_PROFILE, id: PROFILE_DOC_ID };
}

export async function updateProfile(profileData: Partial<SiteProfile>): Promise<void> {
  const profileRef = doc(db, 'siteProfile', PROFILE_DOC_ID);
  await setDoc(
    profileRef,
    {
      ...profileData,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

// ---------------- Projects ----------------
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ProjectItem, 'id'>),
      }));
    }
  } catch (error) {
    console.warn('Firestore getProjects fallback to sample projects:', error);
  }
  return INITIAL_PROJECTS;
}

export async function saveProject(project: ProjectItem): Promise<void> {
  const projectRef = doc(db, 'projects', project.id);
  await setDoc(
    projectRef,
    {
      ...project,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function deleteProject(projectId: string): Promise<void> {
  // Delete project doc
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);

  // Also delete associated project images
  try {
    const imagesCol = collection(db, 'projectImages');
    const q = query(imagesCol, where('projectId', '==', projectId));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((imgDoc) => deleteDoc(imgDoc.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Failed to delete associated project images:', err);
  }
}

// ---------------- Project Images ----------------
export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  try {
    const imagesCol = collection(db, 'projectImages');
    const q = query(
      imagesCol,
      where('projectId', '==', projectId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<ProjectImage, 'id'>),
    }));
  } catch (error) {
    console.warn('Firestore getProjectImages error:', error);
    return [];
  }
}

export async function saveProjectImage(
  image: Omit<ProjectImage, 'id'>,
  customId?: string
): Promise<string> {
  const imageId = customId || `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const imgRef = doc(db, 'projectImages', imageId);
  await setDoc(imgRef, {
    ...image,
    id: imageId,
    createdAt: Date.now(),
  });
  return imageId;
}

export async function deleteProjectImage(imageId: string): Promise<void> {
  const imgRef = doc(db, 'projectImages', imageId);
  await deleteDoc(imgRef);
}

// ---------------- Timeline ----------------
export async function getTimeline(): Promise<TimelineItem[]> {
  try {
    const timelineCol = collection(db, 'timeline');
    const q = query(timelineCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TimelineItem, 'id'>),
      }));
    }
  } catch (error) {
    console.warn('Firestore getTimeline fallback to sample data:', error);
  }
  return INITIAL_TIMELINE;
}

export async function saveTimelineItem(item: TimelineItem): Promise<void> {
  const itemRef = doc(db, 'timeline', item.id);
  await setDoc(itemRef, item, { merge: true });
}

export async function deleteTimelineItem(itemId: string): Promise<void> {
  const itemRef = doc(db, 'timeline', itemId);
  await deleteDoc(itemRef);
}

// ---------------- Skills ----------------
export async function getSkills(): Promise<SkillItem[]> {
  try {
    const skillsCol = collection(db, 'skills');
    const q = query(skillsCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<SkillItem, 'id'>),
      }));
    }
  } catch (error) {
    console.warn('Firestore getSkills fallback to sample data:', error);
  }
  return INITIAL_SKILLS;
}

export async function saveSkillItem(item: SkillItem): Promise<void> {
  const itemRef = doc(db, 'skills', item.id);
  await setDoc(itemRef, item, { merge: true });
}

export async function deleteSkillItem(itemId: string): Promise<void> {
  const itemRef = doc(db, 'skills', itemId);
  await deleteDoc(itemRef);
}
