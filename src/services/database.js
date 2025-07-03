import { database, auth,secondaryAuth } from './firebase.js';
import { ref, push, set, get, update, remove, onValue, off } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

import {createUserWithEmailAndPassword, signOut} from "firebase/auth";

// Generic database operations
export const createRecord = async (path, data) => {
  const id = uuidv4();
  const recordRef = ref(database, `${path}/${id}`);
  await set(recordRef, { ...data, id, createdAt: new Date().toISOString() });
  return id;
};

export const updateRecord = async (path, data) => {
  const recordRef = ref(database, path);
  await update(recordRef, { ...data, updatedAt: new Date().toISOString() });
};

export const deleteRecord = async (path) => {
  const recordRef = ref(database, path);
  await remove(recordRef);
};

export const getRecord = async (path) => {
  const recordRef = ref(database, path);
  const snapshot = await get(recordRef);
  return snapshot.val();
};

export const subscribeToData = (path, callback) => {
  const recordRef = ref(database, path);
  onValue(recordRef, callback);
  return () => off(recordRef, 'value', callback);
};

// User operations
export const createUser = async (uid, userData) => {
  const userRef = ref(database, `users/${uid}`);
  await set(userRef, { ...userData, uid, createdAt: new Date().toISOString() });
};

export const getUserRole = async (uid) => {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  return snapshot.val()?.role || 'patient';
};
//

export const createDoctor = async (doctorData) => {
  try {
    // Use secondary auth instance to avoid logging out admin
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, doctorData.email, doctorData.password);
    const uid = userCredential.user.uid;

    // Optional: sign out secondary auth session (cleanup)
    await signOut(secondaryAuth);

    // Prepare doctor data (omit password)
    const { password, ...doctorWithoutPassword } = doctorData;

    const doctorRef = ref(database, `doctors/${uid}`);
    await set(doctorRef, {
      ...doctorWithoutPassword,
      id: uid,
      uid,
      createdAt: new Date().toISOString(),
    });

    const userRef = ref(database, `users/${uid}`);
    await set(userRef, {
      email: doctorData.email,
      role: 'doctor',
      uid,
      createdAt: new Date().toISOString(),
    });

    return uid;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};
//getdoctor
export const getDoctors = async () => {
  return await getRecord('doctors');
};
//update doctor
export const updateDoctor = async (doctorId, doctorData) => {
  await updateRecord(`doctors/${doctorId}`, doctorData);
};
//delete doctor
export const deleteDoctor = async (doctorId) => {
  await deleteRecord(`doctors/${doctorId}`);
};

// Doctor operations
{/*
export const createDoctor = async (doctorData) => {
  return await createRecord('doctors', doctorData);
};

export const getDoctors = async () => {
  return await getRecord('doctors');
};

export const updateDoctor = async (doctorId, doctorData) => {
  await updateRecord(`doctors/${doctorId}`, doctorData);
};

export const deleteDoctor = async (doctorId) => {
  await deleteRecord(`doctors/${doctorId}`);
};
*/}

// Patient operations
export const createPatient = async (patientData) => {
  return await createRecord('patients', patientData);
};

export const getPatients = async () => {
  return await getRecord('patients');
};

export const updatePatient = async (patientId, patientData) => {
  await updateRecord(`patients/${patientId}`, patientData);
};

export const deletePatient = async (patientId) => {
  await deleteRecord(`patients/${patientId}`);
};

// Medical History operations
export const addMedicalHistory = async (patientId, historyData) => {
  const historyId = uuidv4();
  const historyRef = ref(database, `patients/${patientId}/medicalHistory/${historyId}`);
  await set(historyRef, { ...historyData, id: historyId, createdAt: new Date().toISOString() });
  return historyId;
};

export const updateMedicalHistory = async (patientId, historyId, historyData) => {
  await updateRecord(`patients/${patientId}/medicalHistory/${historyId}`, historyData);
};

export const deleteMedicalHistory = async (patientId, historyId) => {
  await deleteRecord(`patients/${patientId}/medicalHistory/${historyId}`);
};

export const getPatientMedicalHistory = async (patientId) => {
  return await getRecord(`patients/${patientId}/medicalHistory`);
};

// Clinic operations
export const createClinic = async (clinicData) => {
  return await createRecord('clinics', clinicData);
};

export const getClinics = async () => {
  return await getRecord('clinics');
};

export const updateClinic = async (clinicId, clinicData) => {
  await updateRecord(`clinics/${clinicId}`, clinicData);
};

export const deleteClinic = async (clinicId) => {
  await deleteRecord(`clinics/${clinicId}`);
};

// Time Slot operations
export const createTimeSlot = async (clinicId, slotData) => {
  const slotId = uuidv4();
  const slotRef = ref(database, `clinics/${clinicId}/timeSlots/${slotId}`);
  await set(slotRef, { ...slotData, id: slotId, createdAt: new Date().toISOString() });
  return slotId;
};

export const getTimeSlots = async (clinicId) => {
  return await getRecord(`clinics/${clinicId}/timeSlots`);
};

export const updateTimeSlot = async (clinicId, slotId, slotData) => {
  await updateRecord(`clinics/${clinicId}/timeSlots/${slotId}`, slotData);
};

export const deleteTimeSlot = async (clinicId, slotId) => {
  await deleteRecord(`clinics/${clinicId}/timeSlots/${slotId}`);
};

// Appointment operations
export const createAppointment = async (appointmentData) => {
  return await createRecord('appointments', appointmentData);
};

export const getAppointments = async () => {
  return await getRecord('appointments');
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  await updateRecord(`appointments/${appointmentId}`, appointmentData);
};

export const deleteAppointment = async (appointmentId) => {
  await deleteRecord(`appointments/${appointmentId}`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  await updateRecord(`appointments/${appointmentId}`, { status });
};

//reseptionist


//
export const createReceptionist = async (receptionistData) => {
  try {
    // Use secondary auth instance to avoid logging out admin
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      receptionistData.email,
      receptionistData.password
    );
    const uid = userCredential.user.uid;

    // Sign out from secondary session (optional but recommended)
    await signOut(secondaryAuth);

    const { password, ...dataWithoutPassword } = receptionistData;

    // Save in `receptionists` path
    const receptionistRef = ref(database, `receptionists/${uid}`);
    await set(receptionistRef, {
      ...dataWithoutPassword,
      id: uid,
      uid,
      createdAt: new Date().toISOString(),
    });

    // Also create an entry under `users/` with role = receptionist
    const userRef = ref(database, `users/${uid}`);
    await set(userRef, {
      email: receptionistData.email,
      role: 'receptionist',
      uid,
      createdAt: new Date().toISOString(),
    });

    return uid;
  } catch (error) {
    console.error("Error creating receptionist:", error);
    throw error;
  }
};


export const createRecipient = async (recipientData) => {
  return await createRecord('recipients', recipientData);
};

//
export const getRecipients = async () => {
  return await getRecord('recipients');
};

export const updateRecipient = async (recipientId, recipientData) => {
  await updateRecord(`recipients/${recipientId}`, recipientData);
};

export const deleteRecipient = async (recipientId) => {
  await deleteRecord(`recipients/${recipientId}`);
};
