"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { parseArgs } from "util";
import { revalidatePath } from "next/cache";

export interface AppointmentRecentListDataResponse {
  totalCount: number;
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}

interface GetRecentAppointmentListFn {
  (): Promise<AppointmentRecentListDataResponse>;
}

// CREATE A NEW APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};

// GET A SPECIFIC APPOINTMENT
export const getAppointments = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

// GET LIST OF ALL RECENT APPOINTMENTS
export const getRecentAppointmentList: GetRecentAppointmentListFn =
  async () => {
    try {
      const appointments = await databases.listDocuments(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        [Query.orderDesc("$updatedAt")]
      );

      const initialCounts = {
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      };

      const counts = (appointments.documents as Appointment[]).reduce(
        (acc, appointment) => {
          switch (appointment.status) {
            case "scheduled":
              acc.scheduledCount++;
              break;
            case "pending":
              acc.pendingCount++;
              break;
            case "cancelled":
              acc.cancelledCount++;
              break;
          }
          return acc;
        },
        initialCounts
      );

      const data: AppointmentRecentListDataResponse = {
        totalCount: appointments.total,
        ...counts,
        documents: appointments.documents as Appointment[],
      };

      return parseStringify(data);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the recent appointments:",
        error
      );
    }
  };

// UPDATE A SPECIFIC APPOINTMENT (CANCEL, SCHEDULE, UPDATE)
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    //TODO: SMS Notification

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};
