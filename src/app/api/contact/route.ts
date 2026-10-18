import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactInquiry } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters."),
  enquiryType: z.string().trim().min(1, "Please select an enquiry type."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Honeypot check for bots
    if (json.honeypot && json.honeypot.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    const result = contactSchema.safeParse(json);
    if (!result.success) {
      const issue = result.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : "Invalid submission." },
        { status: 400 }
      );
    }

    const { name, email, subject, enquiryType, message } = result.data;

    const dispatch = await sendContactInquiry({
      name,
      email,
      subject,
      enquiryType,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully to Binari Gamage. We will be in touch shortly.",
      reference: dispatch.savedInquiryId,
    });
  } catch (err) {
    console.error("[API/Contact] Error processing contact submission:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending your message. Please try again or reach out directly via email." },
      { status: 500 }
    );
  }
}
