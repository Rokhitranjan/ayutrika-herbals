import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, validateIndianPostalCode } from "@/lib/auth";
import { getUserAddresses, createAddress } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await getUserAddresses(session.userId);
    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json({ error: "All required address fields must be filled." }, { status: 400 });
    }

    if (!validateIndianPostalCode(postalCode)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit Indian PIN code." }, { status: 400 });
    }

    const newAddress = await createAddress(session.userId, {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create address" },
      { status: 500 }
    );
  }
}
