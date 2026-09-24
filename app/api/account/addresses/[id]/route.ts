import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, validateIndianPostalCode } from "@/lib/auth";
import { updateAddress, deleteAddress, setDefaultAddress, getAddressById } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await getAddressById(params.id, session.userId);
    if (!existing) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    const body = await request.json();

    if (body.action === "setDefault") {
      await setDefaultAddress(params.id, session.userId);
      return NextResponse.json({ message: "Default address updated." });
    }

    if (body.postalCode && !validateIndianPostalCode(body.postalCode)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit Indian PIN code." }, { status: 400 });
    }

    const updated = await updateAddress(params.id, session.userId, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await deleteAddress(params.id, session.userId);
    if (!success) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
