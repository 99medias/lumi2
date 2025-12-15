import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@4.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const formData: ContactFormData = await req.json();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(resendApiKey);

    const subjectMap: Record<string, string> = {
      "question-generale": "Question Générale",
      "support-technique": "Support Technique",
      "abonnement": "Abonnement",
      "facturation": "Facturation",
      "autre": "Autre",
    };

    const subjectLabel = subjectMap[formData.subject] || formData.subject;
    const timestamp = new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "full",
      timeStyle: "long",
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message de contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">📧 Nouveau Message de Contact</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 30px;">
                    <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">${timestamp}</p>
                  </td>
                </tr>
                
                <!-- Name -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3f2; border-left: 4px solid #f97316; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nom</p>
                          <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${formData.name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Email & Phone -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="48%" style="vertical-align: top;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; border-radius: 8px;">
                            <tr>
                              <td style="padding: 20px;">
                                <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                <p style="margin: 0; color: #1e293b; font-size: 14px; word-break: break-all;"><a href="mailto:${formData.email}" style="color: #f97316; text-decoration: none;">${formData.email}</a></p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="vertical-align: top;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; border-radius: 8px;">
                            <tr>
                              <td style="padding: 20px;">
                                <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</p>
                                <p style="margin: 0; color: #1e293b; font-size: 14px;">${formData.phone || "Non fourni"}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Subject -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef3f2; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sujet</p>
                          <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${subjectLabel}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px;">
                      <tr>
                        <td style="padding: 24px;">
                          <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Reply Button -->
                <tr>
                  <td style="padding-top: 10px; text-align: center;">
                    <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(subjectLabel)}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Répondre au client</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">MaSécurité</p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">Solutions Cloud sécurisées pour particuliers et professionnels</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const plainTextContent = `
Nouveau Message de Contact - MaSécurité
==========================================

Reçu le: ${timestamp}

NOM: ${formData.name}
EMAIL: ${formData.email}
TÉLÉPHONE: ${formData.phone || "Non fourni"}
SUJET: ${subjectLabel}

MESSAGE:
${formData.message}

--
MaSécurité
Solutions Cloud sécurisées pour particuliers et professionnels
    `;

    const { data, error } = await resend.emails.send({
      from: "MaSécurité <noreply@masecurite.be>",
      to: [
        "customer-requests-aaaaop3vtssop7wgzcc5dfunyi@barqsecure.slack.com",
        "info@masecurite.be"
      ],
      replyTo: formData.email,
      subject: `Nouveau Contact - ${subjectLabel}`,
      html: htmlContent,
      text: plainTextContent,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});