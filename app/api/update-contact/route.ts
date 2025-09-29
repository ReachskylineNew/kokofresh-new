import { NextRequest, NextResponse } from "next/server"
import { createClient, ApiKeyStrategy } from "@wix/sdk"
import { contacts } from "@wix/crm"

export async function PATCH(req: NextRequest) {
  try {
    const { contactId, info } = await req.json()

    if (!contactId) {
      return NextResponse.json({ error: "Missing contactId" }, { status: 400 })
    }

    const wixAdminClient = createClient({
      modules: { contacts },
      auth: ApiKeyStrategy({
        apiKey: process.env.WIX_API_KEY!,
        siteId: process.env.WIX_SITE_ID!,
        accountId: process.env.WIX_ACCOUNT_ID!,
      }),
    })

    // 1. Fetch existing contact
    const contact = await wixAdminClient.contacts.getContact(contactId)
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    let updatedInfo = { ...contact.info, ...info }

    // 2. If updating addresses, rebuild with _id + formatted
    if (info?.addresses?.items?.length) {
      const formAddr = info.addresses.items[0].address
      const existingAddr = contact.info?.addresses?.items?.[0] // pick the first one (shipping)

      if (existingAddr) {
        const newAddr = {
          _id: existingAddr._id, // ✅ keep the same ID so Wix updates
          tag: existingAddr.tag || "SHIPPING",
          address: {
            ...existingAddr.address, // keep old fields
            ...formAddr, // overwrite with new form fields
            formatted: `${formAddr.addressLine1}\n${formAddr.city}, ${formAddr.subdivision} ${formAddr.postalCode}\n${formAddr.countryFullname}`,
          },
        }

        updatedInfo = {
          ...contact.info,
          addresses: { items: [newAddr] },
        }
      }
    }

    // 3. Build payload with revision
    const payload = {
      info: updatedInfo,
      revision: contact.revision,
    }

    // 4. Update in Wix
    const updated = await wixAdminClient.contacts.updateContact(
      contactId,
      payload,
      contact.revision
    )

    return NextResponse.json({ contact: updated.contact })
  } catch (err: any) {
    console.error("❌ Update Contact Error:", err?.response?.data || err)
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 })
  }
}
