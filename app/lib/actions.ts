"use server"; // mark all functions in this file as sever functions, which can be imported into Client and Server components

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// matches the shape of our form object
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.", // Adds error message if user doesn't select a customer
  }),
  amount: z.coerce // since type="number" returns a string, we have to specifically set it's type to a number
    .number() // defaults to 0 if string is empty, so call .gt() to tell Zod we always want an amount greater than 0.
    .gt(0, { message: "Please select an amount greater than $0" }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status", // Adds friendly message if user doesn't select a status
  }),
  date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // 1. Validate form using Zod.
  // safeParse() returns an object containing success or error field, helping to handle validation more gracefully
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Message Fields. Failed to Create Invoice",
    };
  }

  // 2. Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // 3. Insert data into database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    // If database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate cache for invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  // 1. Validate form using Zod.
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  // 2. Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  // 3. Insert data into database
  try {
    await sql`
         UPDATE invoices
         SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
         WHERE id = ${id}
       `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return {
      message: "Datase Error: Failed to Delete Invoice",
    };
  }
}
